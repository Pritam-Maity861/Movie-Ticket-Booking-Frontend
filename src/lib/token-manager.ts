const TOKEN_KEY = "cinemate_access_token";

let accessToken: string | null = null;

try {
  accessToken = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
} catch {
  // localStorage might be unavailable in some browser settings
}

export const tokenManager = {
  setToken(token: string | null) {
    accessToken = token;
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // ignore storage errors
    }
  },
  getToken() {
    if (!accessToken && typeof window !== "undefined") {
      try {
        accessToken = localStorage.getItem(TOKEN_KEY);
      } catch {
        // ignore
      }
    }
    return accessToken;
  },
  clearToken() {
    accessToken = null;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  },
};
