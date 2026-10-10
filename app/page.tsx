import Hero from "@/app/_components/Hero";
import RobotMascotScene from "@/components/robot/RobotMascotScene";
import Footer from "@/app/_components/Footer";
import TechUsedSection from "@/app/_components/TechUsedSection";

export default function Home() {
    return (
        <div className="flex flex-col">
            <Hero>
                <RobotMascotScene />
            </Hero>
            <TechUsedSection/>
            <Footer/>
        </div>
    );
}
