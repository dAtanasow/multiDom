import { useEffect, useState } from "react";

export function useIsMobile(debounceDelay = 150) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        let timeout;

        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setIsMobile(window.innerWidth <= 767);
            }, debounceDelay);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", handleResize);
        };
    }, [debounceDelay]);

    return isMobile;
}


export function useIsTablet(debounceDelay = 150) {
    const [isTablet, setIsTablet] = useState(
        window.innerWidth > 767 && window.innerWidth <= 1024
    );

    useEffect(() => {
        let timeout;

        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const width = window.innerWidth;
                setIsTablet(width > 767 && width <= 1024);
            }, debounceDelay);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", handleResize);
        };
    }, [debounceDelay]);

    return isTablet;
}

export function useIsDesktop(debounceDelay = 150) {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

    useEffect(() => {
        let timeout;

        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setIsDesktop(window.innerWidth > 1024);
            }, debounceDelay);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", handleResize);
        };
    }, [debounceDelay]);

    return isDesktop;
}
