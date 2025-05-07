import { useState } from "react";

import MobileHeaderContent from "./mobile/MobileHeaderContent";
import DesktopHeaderContent from "./desktop/DesktopHeaderContent";
import PanelSwitcher from "./PanelSwitcher";
import { useIsMobile } from "../../hooks/useResponive";
import { usePanel } from "../../hooks/usePanel";

export default function Header() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const { panel: activePanel, setActivePanel, closePanel } = usePanel();

  return (
    <header role="banner" className="bg-white shadow-md sticky top-0 z-50">
      {isMobile ? (
        <MobileHeaderContent
          setMobileMenuOpen={setMobileMenuOpen}
          setShowSearch={setShowSearch}
          showSearch={showSearch}
          mobileMenuOpen={mobileMenuOpen}
        />
      ) : (
        <DesktopHeaderContent />
      )}
      <PanelSwitcher
        activePanel={activePanel}
        closePanel={closePanel}
        setActivePanel={setActivePanel}
      />
    </header>
  );
}
