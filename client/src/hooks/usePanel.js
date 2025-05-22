import { useSearchParams } from "react-router-dom";

export function usePanel() {
    const [searchParams, setSearchParamsRaw] = useSearchParams();
    const panel = searchParams.get("panel");

    const updatePanel = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("panel", value);
        } else {
            params.delete("panel");
        }
        setSearchParamsRaw(params, { replace: true });
    };

    return {
        panel,
        setActivePanel: updatePanel,
        closePanel: () => updatePanel(null),
    };
}
