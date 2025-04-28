import { clearAuth, getAccessToken, setAccessToken } from "../utils/authUtil";

export async function requester(method, url, data) {
    const options = {
        method,
        headers: {},
    };

    const isAuthRequired = !url.includes("/users/login") && !url.includes("/users/register") && !url.includes("/check-availability");

    const accessToken = getAccessToken();

    if (accessToken && isAuthRequired) {
        options.headers['Authorization'] = `Bearer ${accessToken}`;
    } else if (!accessToken && isAuthRequired) {
        throw new Error("No access token found. Please log in.");
    }

    if (method !== "GET" && data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    let response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
        try {
            const refreshResponse = await fetch('/api/auth/refresh-token', {
                method: 'POST',
                credentials: 'include',
            });

            if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                const newAccessToken = refreshData.accessToken;

                if (newAccessToken) {
                    setAccessToken(newAccessToken);

                    options.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    response = await fetch(url, options);
                }
            } else {
                clearAuth();
                window.location.href = '/login';
                return;
            }
        } catch (refreshError) {
            console.error('Грешка при refresh:', refreshError);
            clearAuth();
            window.location.href = '/login';
            return;
        }
    }
    const contentType = response.headers.get("Content-Type");
    const responseText = await response.text();

    let result = {};
    if (contentType && contentType.includes("application/json")) {
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error("Error parsing JSON:", e);
        }
    }

    if (!response.ok) {
        throw new Error(result.message || 'An error occurred');
    }

    if (response.status === 204) return {};

    if (result.accessToken) {
        setAccessToken(result.accessToken);
    }

    return result;
}

export const get = requester.bind(null, 'GET');
export const post = requester.bind(null, 'POST');
export const put = requester.bind(null, 'PUT');
export const del = requester.bind(null, 'DELETE');

export default { get, post, put, del };