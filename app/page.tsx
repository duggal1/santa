import ThisThat from "@/components/before-after";

import CTASection from "@/components/cta";
import Features from "@/components/Features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Howitworks from "@/components/how-it-work";
import Navbar from "@/components/navbar";

export default function Home (){
    return (
        <section>
            <Navbar/>
            <Hero/>
            <Features/>
            <ThisThat/>
            <Howitworks/>
            <CTASection/>
            <Footer/>
        </section>
    )
}