import React from 'react';
import Link from 'next/link';

const AboutSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">About Brixta: Your Real-Time Construction Material Price Tracker in Guwahti (Assam, India)</h2>
          <p className="text-lg text-gray-300">
            Welcome to Brixta, your dedicated online platform for staying informed about the latest construction material prices across India. We empower you with accurate, up-to-date price information for essential materials, enabling informed decisions for your construction projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Benefit Cards */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 text-center transition duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Real-Time Price Updates</h3>
            <p className="text-gray-600">
              Access constantly updated price data for Guwahti, Assam, India. Helping you track market trends and optimize procurement timing for cost savings.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 text-center transition duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Comprehensive Material Coverage</h3>
            <p className="text-gray-600">
              We cover a wide range of crucial construction materials: cement, steel, bricks, aggregates, and sand, providing a holistic market view.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 text-center transition duration-300 hover:shadow-xl md:col-span-2 lg:col-span-1 md:justify-self-center">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Localized Information (Assam)</h3>
            <p className="text-gray-600">
              We&#34;re working towards localized price insights to help you find the best deals from suppliers in your region. Stay tuned!
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 text-center transition duration-300 hover:shadow-xl md:justify-self-center">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Empowering Informed Decisions</h3>
            <p className="text-gray-600">
              Brixta equips you with the knowledge to plan budgets effectively and negotiate better prices, whether you&#34;re a contractor or homeowner.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 text-center transition duration-300 hover:shadow-xl md:col-span-2 lg:col-span-1 md:justify-self-center">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">User-Friendly Platform</h3>
            <p className="text-gray-600">
              Our intuitive website design ensures you can quickly find the price information you need without any hassle.
            </p>
          </div>
        </div>

        {/* Appealing Call to Action Button below cards */}
        <div className="mt-12 text-center">
          <Link href="/leads" className="inline-block bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-md">
            View Latest Prices &rarr;
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-300">
            Have questions or suggestions? <Link href="#footer" className="text-blue-500 hover:underline">Contact Us</Link> today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;