import { useApi as useApiBase } from "./api.js";
import { useAuth as useAuthBase } from "./auth.js";
import { useErrorBoundary as useErrorBoundaryBase } from "./errorBoundary";
import { useFetch as useFetchBase } from "./fetch.js";
import { useSite as useSiteBase } from "./site.js";

export const useAuth = useAuthBase;
export const useApi = useApiBase;
export const useFetch = useFetchBase;
export const useErrorBoundary = useErrorBoundaryBase;
export const useSite = useSiteBase;
