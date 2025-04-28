import Login from "../login/Login";
import Register from "../register/Register";

export default function PanelSwitcher({ activePanel, closePanel, setActivePanel }) {
    if (activePanel === "login") {
        return <Login onClose={closePanel} onRegisterClick={() => setActivePanel("register")} />;
    }
    if (activePanel === "register") {
        return <Register onClose={closePanel} onLoginClick={() => setActivePanel("login")} />;
    }
    return null;
}