const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const apiFetch = async (url, options = {}) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = user?.token;

  const isFormData = options.body instanceof FormData;
  const headers = { ...options.headers };

  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("user");
    window.location.reload();
    return response;
  }

  return response;
};
