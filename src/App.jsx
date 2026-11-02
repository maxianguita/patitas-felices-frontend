import {Suspense} from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />
      <div>
        <Suspense fallback={<div role="status" className="flex min-h-[55vh] items-center justify-center text-green-800">Cargando...</div>}><Outlet /></Suspense>
      </div>
      <Footer />
    </>
  );
}
