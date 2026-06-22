import { useQuery } from "@tanstack/react-query";
import api from "../config/axios";

export function useRanking() {
  return useQuery({
    queryKey: ["ranking"],
    queryFn: () => api.get("/ranking").then((r) => r.data),
    refetchInterval: 30000,
  });
}

export function useMinhasEstatisticas() {
  return useQuery({
    queryKey: ["ranking", "minhas"],
    queryFn: () => api.get("/ranking/me").then((r) => r.data),
    refetchInterval: 30000,
  });
}
