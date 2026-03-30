import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesBar from "@/components/FeaturesBar";
import CategoriesSection from "@/components/CategoriesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FloatingTelegram from "@/components/FloatingTelegram";

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <main className="flex-1">
      <HeroSection />
      <FeaturesBar />
      <CategoriesSection />
      <CTASection />
    </main>
    <Footer />
    <FloatingTelegram />
  </div>
);

export default Index;
