import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HorizontalGallery from "@/components/HorizontalGallery";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Process from "@/components/Process";
import PhotoBreak from "@/components/PhotoBreak";
import Services from "@/components/Services";
import Reviews from "@/components/Reviews";
import Booking from "@/components/Booking";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <>
      <main className="bg-black light:bg-[#f5f0eb]">
        <Navbar />
        <Hero />
        <HorizontalGallery />
        <Marquee />
        <About />
        <Process />
        <PhotoBreak
          src="/photos/20251010-DSC02484.jpg"
          alt="Athlete celebrates with teammates after race"
          caption="The moment after."
          subcaption="©kabirjphoto"
        />
        <Services />
        <Reviews />
        <Booking />
      </main>
      <ScrollToTop />
    </>
  );
}
