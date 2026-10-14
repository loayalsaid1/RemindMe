"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768; // md breakpoint

/**
 * Returns true when the viewport is narrower than the `md` breakpoint.
 * Starts as false (SSR-safe) and updates after mount.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mql.matches);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
