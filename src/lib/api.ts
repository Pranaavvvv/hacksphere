const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hacksphere_auth_token");
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res: Response, url: string) {
  const data = await res.json();

  if (res.status === 401 && !url.startsWith("/api/auth")) {
    // Token expired or invalid on a protected route — clear and redirect
    if (typeof window !== "undefined") {
      localStorage.removeItem("hacksphere_auth_token");
      localStorage.removeItem("hacksphere_user");
      localStorage.removeItem("hacksphere_role");
      window.location.href = "/auth";
    }
    throw new Error("Session expired. Please sign in again.");
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

const api = {
  get: async (url: string) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: authHeaders(),
    });
    return handleResponse(res, url);
  },

  post: async (url: string, body?: unknown) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res, url);
  },
};

export default api;
