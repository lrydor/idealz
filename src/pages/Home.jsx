import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Contact from "../components/Contact";
import About from "../components/About";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* Optional: gives full-page height and soft background */}
      <Navbar />
      <Hero />
      <About />
      <Contact />
    </div>
  );
}
