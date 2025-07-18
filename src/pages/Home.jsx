import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Grid from '../components/Grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Optional: gives full-page height and soft background */}
      <Navbar />
      <Hero />
      <Grid />
    </div>
  )
}

