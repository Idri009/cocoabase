export const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

export const isServer = (): boolean => {
  return typeof window === "undefined";
};

export const getUserAgent = (): string => {
  if (!isBrowser()) return "";
  return navigator.userAgent;
};

export const isMobile = (): boolean => {
  if (!isBrowser()) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isTablet = (): boolean => {
  if (!isBrowser()) return false;
  return /iPad|Android/i.test(navigator.userAgent) && !isMobile();
};

export const isDesktop = (): boolean => {
  if (!isBrowser()) return false;
  return !isMobile() && !isTablet();
};

export const getBrowserName = (): string => {
  if (!isBrowser()) return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Unknown";
};

export const getOSName = (): string => {
  if (!isBrowser()) return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown";
};

export const getViewportSize = (): { width: number; height: number } => {
  if (!isBrowser()) return { width: 0, height: 0 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const getScreenSize = (): { width: number; height: number } => {
  if (!isBrowser()) return { width: 0, height: 0 };
  return {
    width: screen.width,
    height: screen.height,
  };
};

export const getScrollPosition = (): { x: number; y: number } => {
  if (!isBrowser()) return { x: 0, y: 0 };
  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset,
  };
};

export const scrollToTop = (behavior: ScrollBehavior = "smooth"): void => {
  if (!isBrowser()) return;
  window.scrollTo({ top: 0, behavior });
};

export const scrollToBottom = (behavior: ScrollBehavior = "smooth"): void => {
  if (!isBrowser()) return;
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
};

export const scrollToElement = (
  elementId: string,
  behavior: ScrollBehavior = "smooth",
  offset: number = 0
): void => {
  if (!isBrowser()) return;
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!isBrowser()) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
};

export const readFromClipboard = async (): Promise<string> => {
  if (!isBrowser()) return "";
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText();
    }
    return "";
  } catch {
    return "";
  }
};

export const share = async (
  data: ShareData
): Promise<boolean> => {
  if (!isBrowser() || !navigator.share) return false;
  try {
    await navigator.share(data);
    return true;
  } catch {
    return false;
  }
};

export const downloadBlob = (
  blob: Blob,
  filename: string
): void => {
  if (!isBrowser()) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

export const openInNewTab = (url: string): void => {
  if (!isBrowser()) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const reload = (): void => {
  if (!isBrowser()) return;
  window.location.reload();
};

export const goBack = (): void => {
  if (!isBrowser()) return;
  window.history.back();
};

export const goForward = (): void => {
  if (!isBrowser()) return;
  window.history.forward();
};

export const getQueryParams = (): Record<string, string> => {
  if (!isBrowser()) return {};
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

export const setQueryParam = (key: string, value: string): void => {
  if (!isBrowser()) return;
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, "", url.toString());
};

export const removeQueryParam = (key: string): void => {
  if (!isBrowser()) return;
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.pushState({}, "", url.toString());
};

export const isOnline = (): boolean => {
  if (!isBrowser()) return false;
  return navigator.onLine;
};

export const getConnectionType = (): string => {
  if (!isBrowser()) return "unknown";
  const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
  return connection?.effectiveType || "unknown";
};

export const requestFullscreen = async (element?: HTMLElement): Promise<boolean> => {
  if (!isBrowser()) return false;
  const el = element || document.documentElement;
  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
      return true;
    }
    if ((el as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
      (el as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
      return true;
    }
    if ((el as unknown as { mozRequestFullScreen?: () => void }).mozRequestFullScreen) {
      (el as unknown as { mozRequestFullScreen: () => void }).mozRequestFullScreen();
      return true;
    }
    if ((el as unknown as { msRequestFullscreen?: () => void }).msRequestFullscreen) {
      (el as unknown as { msRequestFullscreen: () => void }).msRequestFullscreen();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const exitFullscreen = async (): Promise<boolean> => {
  if (!isBrowser()) return false;
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
      return true;
    }
    if ((document as unknown as { webkitExitFullscreen?: () => void }).webkitExitFullscreen) {
      (document as unknown as { webkitExitFullscreen: () => void }).webkitExitFullscreen();
      return true;
    }
    if ((document as unknown as { mozCancelFullScreen?: () => void }).mozCancelFullScreen) {
      (document as unknown as { mozCancelFullScreen: () => void }).mozCancelFullScreen();
      return true;
    }
    if ((document as unknown as { msExitFullscreen?: () => void }).msExitFullscreen) {
      (document as unknown as { msExitFullscreen: () => void }).msExitFullscreen();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const isFullscreen = (): boolean => {
  if (!isBrowser()) return false;
  return !!(
    document.fullscreenElement ||
    (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
    (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
    (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
  );
};

export const vibrate = (pattern: number | number[]): boolean => {
  if (!isBrowser() || !navigator.vibrate) return false;
  return navigator.vibrate(pattern);
};

export const getPreferredLanguage = (): string => {
  if (!isBrowser()) return "en";
  return navigator.language || "en";
};

export const getTimezone = (): string => {
  if (!isBrowser()) return "UTC";
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getColorScheme = (): "light" | "dark" => {
  if (!isBrowser()) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const watchColorScheme = (
  callback: (scheme: "light" | "dark") => void
): (() => void) => {
  if (!isBrowser()) return () => {};
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };
  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
};

