import Header from "../components/Header.jsx";
import HeroSection from "../components/HeroSection.jsx";
import CategoryList from "../components/CategoryList.jsx";
import RestaurantOnSpot from "../components/RestaurantOnSpot.jsx";
import Download from "../components/Download.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Footer from "../components/Footer.jsx";

import categories from "../components/category.js";
import restaurants from "../components/restaurantsData";
import "../App.css";


export default function Home() {
  return (
    <section className="home-page">
      <Header />
      <HeroSection />
      <CategoryList categories={categories} />
      <RestaurantOnSpot restaurants={restaurants} />
      <HowItWorks />
      <Download />
      <Footer />
    </section>
  );
}
