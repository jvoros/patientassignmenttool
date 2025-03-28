import { ref, reactive } from "vue";
import { useApi } from "./api.js";

const api = useApi();

const details = reactive({
  role: null,
  site: null,
  id: null,
});

const authError = ref();

export const useAuth = () => {
  const setState = (data) => {
    details.role = data.role;
    details.site = data.site;
    details.id = data.id;
  };

  const login = async (code, site) => {
    const { data, error } = await api.post("api/auth/login", { site: site, code: code });
    if (error) {
      authError.value = error;
    }
    if (!data) return;
    console.log("[auth] login success");
    authError.value = null;
    setState(data);
  };

  const logout = async () => {
    const { data } = await api.post("api/auth/logout");
    if (!data) return;
    console.log("[auth] logout success");
    details.role = null;
    details.id = null;
    details.site = null;
  };

  const checkLogin = async () => {
    const { data } = await api.post("api/auth/checkLogin");
    if (!data) return false;
    console.log("[auth] checkLogin success.");
    setState(data);
    return true;
  };

  return {
    details,
    error: authError,
    login,
    logout,
    checkLogin,
  };
};
