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
            <p className="mt-6 text-lg text-muted-foreground text-left max-w-md">
              Real-time construction material price updates.
            </p>
          </div>

          {/* Right Column: Button Section */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-lg sm:text-xl font-normal text-white leading-relaxed">
              Fill out a{/* <br className="hidden sm:block" /> */}
              <span className="text-yellow-600"> GOOGLE FORM </span><br className="hidden sm:block" />
              and List your shop/business with us
            </p>
            <a
              href="https://forms.gle/yourGoogleFormId"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4" // Add margin-top for better spacing
            >
              <button
                className="flex items-center text-center gap-2 bg-black text-white border border-yellow-500 shadow-[0_0_12px_2px_rgba(30,64,175,0.4)] hover:shadow-[0_0_18px_3px_rgba(30,64,175,0.3)] transition-all duration-300
              px-6 py-3 rounded-full text-base font-semibold">
                Join Now
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}