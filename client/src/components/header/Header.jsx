import { useEffect, useState } from "react";

import MobileHeaderContent from "./mobile/MobileHeaderContent";
import DesktopHeaderContent from "./desktop/DesktopHeaderContent";
import PanelSwitcher from "./PanelSwitcher";
import { useIsMobile } from "../../hooks/useResponsive";
import { usePanel } from "../../hooks/usePanel";
import { toast } from "sonner";
import { setAccessToken } from "../../utils/authUtil";
import { useAuthContext } from "../../context/AuthContext";
import userApi from "../../api/auth";

export default function Header() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { changeAuthState } = useAuthContext();

  const { panel: activePanel, setActivePanel, closePanel } = usePanel();
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "EMAIL_CONFIRMED") {
        const token = event.data.accessToken;
        setAccessToken(token);
        try {
          const user = await userApi.getCurrentUser();
          changeAuthState({ user, accessToken: token });
          toast.success("Имейлът е потвърден и сте логнати.");
        } catch (err) {
          toast.error("Грешка при вход.");
          console.log(err.message);

        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [changeAuthState]);

  return (
    <header className="fixed top-0 left-0 w-full h-[64px] z-50 bg-white shadow">
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
