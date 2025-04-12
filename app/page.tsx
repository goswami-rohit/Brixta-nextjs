import ChartsSection from "@/components/layout/homePageLogic/ChartSection";
import HeroSection from "@/components/layout/homePageLogic/Landing";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Hero Section with margin below */}
        <div className="mb-16 sm:mb-24">
          <HeroSection />
        </div>

        {/* Stylized Divider and Charts Section */}
        <div className="relative px-4 sm:px-8">
          {/* Glowing border on top and fading side borders */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500/70 shadow-[0_0_10px_2px_rgba(59,130,246,0.4)] rounded-t-full" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-blue-500 to-transparent rounded-full" />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-blue-500 to-transparent rounded-full" />

          {/* Chart section content */}
          <div className="relative z-10 pt-8 sm:pt-12 pb-16 sm:pb-22">
            <ChartsSection />
          </div>

          <div className="w-full bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 
          shadow-md px-6 sm:px-10 py-3 text-sm sm:text-base text-white leading-relaxed">
            <h3 className="text-xl font-semibold mb-4">Measurement Units</h3>
            <p>
              Wondering how each material is priced? — for example, Cement is sold per bag or kilo, while Steel might be sold per rod or per kilo. 
              This helps you understand exactly what you are paying for.
            </p>
          </div>

          <div className=" mb-22 mt-12 w-full flex flex-col items-center gap-4 px-4 sm:px-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg sm:text-xl font-medium text-white">
                Check out all your local sellers here
              </p>
              <Link href="/sellers">
                <button
                  className="flex items-center gap-2 bg-black text-white border border-blue-600 shadow-[0_0_12px_2px_rgba(30,64,175,0.4)] hover:shadow-[0_0_18px_3px_rgba(30,64,175,0.6)] transition-all duration-300 
                  px-6 py-3 rounded-full text-base font-semibold">
                  View Sellers <FaArrowRight className="ml-1" />
                </button>
              </Link>
            </div>

            
          </div>

          

        </div>
      </div>
    </div>
  );
}
