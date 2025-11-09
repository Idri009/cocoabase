export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
};

export type Response<T = unknown> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
};

class NetworkError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

export const request = async <T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<Response<T>> => {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = 30000,
    retries = 0,
    retryDelay = 1000,
  } = options;

  const makeRequest = async (): Promise<Response<T>> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        signal: controller.signal,
      };

      if (body && method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      return {
        data: data as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        ok: response.ok,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new NetworkError("Request timeout", 408);
      }
      throw error;
    }
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await makeRequest();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError || new NetworkError("Request failed");
};

export const get = async <T = unknown>(
  url: string,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<Response<T>> => {
  return request<T>(url, { ...options, method: "GET" });
};

export const post = async <T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<Response<T>> => {
  return request<T>(url, { ...options, method: "POST", body });
};

export const put = async <T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<Response<T>> => {
  return request<T>(url, { ...options, method: "PUT", body });
};

export const del = async <T = unknown>(
  url: string,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<Response<T>> => {
  return request<T>(url, { ...options, method: "DELETE" });
};

export const patch = async <T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<Response<T>> => {
  return request<T>(url, { ...options, method: "PATCH", body });
};

export const checkConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch("https://www.google.com/favicon.ico", {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-cache",
    });
    return true;
  } catch {
    return false;
  }
};

export const getNetworkSpeed = async (): Promise<number | null> => {
  if (!("connection" in navigator)) {
    return null;
  }

  const connection = (navigator as unknown as { connection?: { downlink?: number } }).connection;
  return connection?.downlink || null;
};

export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const watchOnlineStatus = (
  callback: (isOnline: boolean) => void
): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};

export const createAbortController = (): AbortController => {
  return new AbortController();
};

export const createTimeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
  });
};

export const withTimeout = async <T>(
  promise: Promise<T>,
  ms: number
): Promise<T> => {
  return Promise.race([promise, createTimeout(ms)]);
};

