import { useEffect, useState } from "react";
import Login from "../login/Login";
import Register from "../register/Register";

export default function PanelSwitcher({ activePanel, closePanel, setActivePanel }) {
    const [visible, setVisible] = useState(false);
    const [currentPanel, setCurrentPanel] = useState(null);

    useEffect(() => {
        if (!activePanel) {
            setVisible(false);
            setTimeout(() => setCurrentPanel(null), 300);
            return;
        }

        if (currentPanel === null) {
            setCurrentPanel(activePanel);
            setTimeout(() => setVisible(true), 10);
            return;
        }

        if (currentPanel !== activePanel) {
            setVisible(false);
            setTimeout(() => {
                setCurrentPanel(activePanel);
                setTimeout(() => setVisible(true), 10);
            }, 300);
        }
    }, [activePanel]);


    if (!currentPanel) return null;

    if (currentPanel === "login") {
        return (
            <Login
                visible={visible}
                onRegisterClick={() => setActivePanel("register")}
            />
        );
    }

    if (currentPanel === "register") {
        return (
            <Register
                visible={visible}
                onClose={closePanel}
                onLoginClick={() => setActivePanel("login")}
            />
        );
    }

    return null;
}
