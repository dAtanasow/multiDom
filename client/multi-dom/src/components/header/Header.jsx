import React, { useState } from "react";
import Login from "../login/Login";
import Register from "../register/Register";
import MobileHeaderContent from "./mobile/MobileHeaderContent";
import DesktopHeaderContent from "./desktop/DesktopHeaderContent";

export default function Header() {
  const [activePanel, setActivePanel] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const closePanel = () => setActivePanel(null);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <MobileHeaderContent
        setActivePanel={setActivePanel}
        setMobileMenuOpen={setMobileMenuOpen}
        setShowSearch={setShowSearch}
        showSearch={showSearch}
        mobileMenuOpen={mobileMenuOpen}
      />

      <DesktopHeaderContent setActivePanel={setActivePanel} />

      {activePanel === "login" && (
        <Login
          onClose={closePanel}
          onRegisterClick={() => setActivePanel("register")}
        />
      )}
      {activePanel === "register" && (
        <Register
          onClose={closePanel}
          onLoginClick={() => setActivePanel("login")}
        />
      )}
    </header>
  );
}
