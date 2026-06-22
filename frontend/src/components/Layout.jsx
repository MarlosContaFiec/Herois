import Navbar from "./Navbar";
import { container } from "../styles/components";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className={`${container} py-8`}>{children}</main>
    </div>
  );
}
