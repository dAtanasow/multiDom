import React, { useState } from "react";

import MobileHeaderContent from "./mobile/MobileHeaderContent";
import DesktopHeaderContent from "./desktop/DesktopHeaderContent";
import PanelSwitcher from "./PanelSwitcher";

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

      <PanelSwitcher activePanel={activePanel} closePanel={closePanel} setActivePanel={setActivePanel} />

    </header>
  );
}
