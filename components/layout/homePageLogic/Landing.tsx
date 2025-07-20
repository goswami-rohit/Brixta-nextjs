import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full flex justify-center items-center py-12 sm:py-16 md:py-20 lg:py-24 min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center justify-center">
          {/* Left Column: Explanatory Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Your Instant Source for Cement & TMT Prices
              </span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-md text-slate-300">
              Track live prices, get instant quotes, and manage inquiries
              effortlessly with <span className="font-semibold text-blue-200">CemTemBot</span>.
            </p>
          </div>

          {/* Right Column: Container with Background Image*/}
          <div className="relative flex flex-col items-center md:items-end justify-center
                          min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[480px]
                          rounded-lg overflow-hidden"> {/* Parent container has no bg image here anymore */}

            {/* Dedicated div for the background image, placed absolutely and blurred */}
            <div
              className="absolute inset-0 bg-[url('/signIn-bg-Image.webp')] bg-cover bg-center
                           filter blur-xs transform scale-105 
                           z-0"
            ></div>

            {/* Optional: Overlay div for better text/button readability */}
            {/* This sits on top of the blurred image (z-10) */}
            <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

            {/* Button and text - these elements will sit on top of everything (higher z-index) */}
            <div className="relative z-20 flex flex-col items-center md:items-end">
              <div
                className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold py-2.5 px-8 sm:py-3 sm:px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer w-fit"
              >
                <Link
                  href="/chatwindow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full text-center no-underline text-lg sm:text-xl"
                >
                  Chat With CemTemBot
                </Link>
              </div>
              {/* <p className="text-gray-400 text-sm mt-3">Opens in New Tab</p> */}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}