import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Contact from "../components/Contact";
import About from "../components/About";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#efebe9] to-[#d7ccc8]">
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
