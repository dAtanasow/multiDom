import { Toaster } from "sonner";

export default function ToastWrapper() {
    return (
        <Toaster
            position="top-right"
            duration={2500}
            expand
            richColors
            toastOptions={{
                style: {
                    marginTop: "50px",
                },
            }}
        />
    );
}