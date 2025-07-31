import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Contact from "../components/Contact";
import About from "../components/About";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-100 to-amber-100">
      <Navbar />
      <Hero />
      
      <div className="space-y-28 px-4 sm:px-8 lg:px-16 py-28">
        <About />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}