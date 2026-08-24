import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
}
