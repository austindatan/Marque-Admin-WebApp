export const apiFetch = async (url, options = {}) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = user?.token;

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...options.headers,
  };

  // ❗ Only set JSON header if NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};