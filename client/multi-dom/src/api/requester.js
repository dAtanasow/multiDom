import { getAccessToken, setAccessToken, clearAuth } from "../utils/authUtil";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_URL;

export async function requester(method, url, data) {
    const options = {
        method,
        headers: {},
        credentials: "include",
    };

    const accessToken = getAccessToken();

    const isAuthRequired =
        !url.includes("/auth/login") &&
        !url.includes("/auth/register")

    if (accessToken && isAuthRequired) {
        options.headers["Authorization"] = `Bearer ${accessToken}`;
    } else if (!accessToken && isAuthRequired) {
        return handleUnauthorized();
    }

    if (method !== "GET" && data) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    let response = await fetch(url, options);
    if ((response.status === 401 || response.status === 403)) {
        const refreshSuccess = await tryRefreshToken();
        if (refreshSuccess) {
            const newToken = getAccessToken();
            if (newToken) {
                options.headers = {
                    ...options.headers,
                    "Authorization": `Bearer ${newToken}`,
                };
                response = await fetch(url, options);
            }
        } else {
            return handleUnauthorized();
        }
    }

    const contentType = response.headers.get("Content-Type");

    let result = {};
    if (contentType?.includes("application/json")) {
        try {
            result = await response.json();
        } catch (e) {
            console.error("Грешка при парсване на JSON:", e);
        }
    }

    if (!response.ok) {
        if (response.status === 409) {
            console.warn('Конфликт: ', result.message || 'Грешка 409');
            return { status: 409, data: result };
        }

        throw new Error(result.message || 'Възникна грешка');
    }

    if (response.status === 204) return {};

    if (result.accessToken) {
        setAccessToken(result.accessToken);
    }

    return result;
}

async function tryRefreshToken() {
    try {
        const response = await fetch(`${baseUrl}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) return false;

        const data = await response.json();
        if (data.accessToken) {
            setAccessToken(data.accessToken);
            return true;
        }

        return false;
    } catch (err) {
        console.error("Грешка при опит за refresh:", err);
        return false;
    }
}

function handleUnauthorized() {
    clearAuth();
    toast.error("Сесията ви е изтекла. Моля, влезте отново.");
    window.location.href = "/";
}

export const get = requester.bind(null, "GET");
export const post = requester.bind(null, "POST");
export const put = requester.bind(null, "PUT");
export const del = requester.bind(null, "DELETE");

export default { get, post, put, del };
