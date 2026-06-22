import { useMemo } from "react";
import { useColecao } from "../api/colecao";

export default function useColecaoOrdenada() {
  const { data, isLoading, error } = useColecao();

  const ordenada = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      if (a.favorito && !b.favorito) return -1;
      if (!a.favorito && b.favorito) return 1;
      return b.carta.poder - a.carta.poder;
    });
  }, [data]);

  return { data: ordenada, isLoading, error };
}
