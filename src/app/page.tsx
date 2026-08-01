import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import PromotionalBanner from "@/components/PromotionalBanner";
import ProductGrid from "@/components/ProductGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import CustomerReviews from "@/components/CustomerReviews";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBadges />
      <PromotionalBanner />
      <ProductGrid />
      <WhyChooseUs />
      <CustomerReviews />
      <FAQSection />
    </main>
  );
}