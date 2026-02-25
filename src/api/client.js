import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ── Auth ──────────────────────────────────────────────
export const login = (username, password) => {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);
  return api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

// ── Employees ─────────────────────────────────────────
export const getEmployees = () => api.get("/employees/");
export const createEmployee = (data) => api.post("/employees/", data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// ── Attendance ────────────────────────────────────────
export const markAttendance = (data) => api.post("/attendance/", data);
export const getAttendance = (empId) =>
  api.get(`/attendance/employee/${empId}`);

export default api;
