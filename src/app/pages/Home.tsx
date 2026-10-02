import Navbar from "../common/Navbar";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import EarnMoney from "../sections/EarnMoney";
import MoreFeatures from "../sections/Morefeatures";
import Explore from "../sections/Explore";
import SocialConnect from "../sections/SocialConnect";
import Contact from "../sections/Contact";
import BottomToTop from "../common/BottomToTop";
import Footer from "../common/Footer";
export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />

                {/* Features: section already carries its own padding + bg */}
                <section id="features">
                    <Features />
                </section>

                {/* Earn Money: section already carries its own padding + bg */}
                <section id="earn-money">
                    <EarnMoney />
                </section>

                {/* Placeholder sections — keep min-h-screen ONLY on these */}
                <section id="special-features">
                    <MoreFeatures />
                </section>

                <section id="explore">
                    <Explore />
                </section>
                <SocialConnect />
                <section id="contact" className="py-20">
                          <Contact />
                </section>
            </main>
            <Footer />
            <BottomToTop />
        </>
    );
}