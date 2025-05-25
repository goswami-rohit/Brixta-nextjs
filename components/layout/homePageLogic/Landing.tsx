import React from "react";


export default function HeroSection() {
  return (
    <section className="w-full flex justify-center items-center py-12 sm:py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center justify-center">
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center text-left">
            <h1 className="font-bold text-blue-600 tracking-tight text-5xl md:text-6xl lg:text-8xl relative inline-flex items-baseline">
              Brixta
              <span className="absolute inset-0 bg-blue-500 opacity-20 rounded-md mix-blend-overlay"></span>
            </h1>
            <p className="mt-1 text-left text-lg text-muted-foreground normal-case">
              by <span className="font-semibold text-blue-200 text-xl">My Coco</span>
            </p>
          </div>

          {/* Right Column: Description Text */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                {' '}Price Tracker
              </span>
            </h2>
            <p className="mt-4 text-lg max-w-md text-slate-300">
              Track live prices for locally available TMT bars and cement, updated in real-time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}