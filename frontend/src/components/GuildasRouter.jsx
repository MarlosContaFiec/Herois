import { useMinhaGuilda } from "../api/guilda";
import { Navigate } from "react-router-dom";
import Guildas from "../pages/Guildas";

export default function GuildasRouter() {
  const { data: guilda, isLoading } = useMinhaGuilda();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (guilda) {
    return <Navigate to={`/guildas/${guilda.id}`} replace />;
  }

  return <Guildas />;
}
