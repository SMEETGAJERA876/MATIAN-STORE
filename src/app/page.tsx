import Hero from "@/components/Hero";
import PromotionalBanner from "@/components/PromotionalBanner";
import ProductGrid from "@/components/ProductGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import CustomerReviews from "@/components/CustomerReviews";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <PromotionalBanner />
      <ProductGrid isTeaser={true} />
      <WhyChooseUs />
      <CustomerReviews />
      <FAQSection />
    </main>
  );
}
