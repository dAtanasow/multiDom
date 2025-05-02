export function openLoginPanel() {
    const url = new URL(window.location.href);
    url.searchParams.set("panel", "login");
    window.history.replaceState({}, "", url.toString());
}

export function closePanelParam() {
    const url = new URL(window.location.href);
    url.searchParams.delete("panel");
    window.history.replaceState({}, "", url.toString());
}