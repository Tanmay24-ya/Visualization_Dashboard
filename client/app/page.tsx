import { Suspense } from "react";
import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <Dashboard />
    </Suspense>
  );
}