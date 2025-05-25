//import ChartsSection from "@/components/layout/homePageLogic/ChartSection2";
import SellersPageContent from '@/components/layout/sellersPageLogic/TableSelectLogic3';
import HeroSection from "@/components/layout/homePageLogic/Landing";
import Head from "next/head";
//import Link from "next/link";
//import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (<>
    <Head>
      <title>MyCoco - Delicious Homemade Chocolates</title>
        <meta property="og:title" content="Brixta-Mycoco" />
        <meta
          property="og:description"
          content="Brixta is your own easy & handy price tracker for TMT Bars and Cement.
          Stay upto date with Brixta's latest prices and make informed decisions when buying TMT and Cement!"
        />
    </Head>
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
            {/* <ChartsSection /> */}
             <SellersPageContent/>
          </div>

          {/*Google Form Btn */}
          <div className="flex flex-col items-center text-center mb-14">
            <p className="text-lg sm:text-xl font-normal text-white leading-relaxed">
              Fill out a
              <span className="text-yellow-600"> GOOGLE FORM </span><br className="hidden sm:block" />
              and List your shop/business with us
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfbTioMBSBeHiUGoIFtrkHefPwQUqynyfvH6IGW2oH4ImWPOw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4" 
            >
              <button
                className="flex items-center text-center gap-2 bg-black text-white border border-yellow-500 shadow-[0_0_12px_2px_rgba(30,64,175,0.4)] hover:shadow-[0_0_18px_3px_rgba(30,64,175,0.3)] transition-all duration-300
              px-6 py-3 rounded-full text-base font-semibold">
                Join Now
              </button>
            </a>
          </div>

          <div className="w-full bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 
          shadow-md px-6 sm:px-10 py-2 text-sm sm:text-base text-white leading-relaxed">
            <h3 className="text-center text-2xl font-bold mb-4">Measurement Units</h3>
            <p>
              <span className="text-lg font-semibold block">How We Measure/Price Our Materials ?</span><br/>
              At Brixta, we adhere to market-standard measurements for all our materials. Please refer to the unit costs below:</p>
              {/* <li>Bricks- per unit = 1 single brick</li>
              <li>Sand- per unit = 1 cft</li>
              <li>Stone- per unit = 1 cft</li> */}
              <li>Cement- per unit = 1 bag (50kg)</li>
              <li>TMT- per unit/per mm = 1 rod/bar </li>
          </div>

          {/*<div className=" mb-22 mt-12 w-full flex flex-col items-center gap-4 px-4 sm:px-8 text-center">
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
          </div>*/}

          

        </div>
      </div>
    </div>
  </>);
}
