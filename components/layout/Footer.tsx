import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import * as React from "react"


const sections = [
  {
    title: "Contact",
    links: [
      { name: "rehaz.a28@gmail.com", href: "rehaz.a28@gmail.com" },
      { name: "rohit.second44@gmail.com", href: "rohit.second44@gmail.com" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Advertise With Us", href: "#" },
      { name: "Privacy", href: "/privacypolicy" },
      { name: "Terms & Conditions", href: "/termsconditions" }
    ],
  }
];


export default function Footer() {
  return (
    <footer
      id="footer"
      className="w-full text-white px-4 py-10 sm:px-6 sm:py-14 backdrop-blur-md bg-white/5 border-t border-white/10 shadow-inner"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col gap-12 lg:flex-row lg:justify-between">
        {/* Left: Logo and Info */}
        <div className="flex flex-col items-center text-center gap-6 lg:items-start lg:text-left">
          <div className="flex items-center gap-2">
          <h1 className="text-white text-4xl font-bolder">Brixta</h1>
            
          </div>

          <p className="text-sm text-muted-foreground max-w-xs">
            BRIXTA by MyCoco is here for your regular materials price updates!
          </p>

          <ul className="flex space-x-6 text-muted-foreground">
            <li className="hover:text-primary">
              <a href="#"><FaWhatsapp className="size-6" /></a>
            </li>
            <li className="hover:text-primary">
              <a href="#"><FaInstagram className="size-6" /></a>
            </li>
            <li className="hover:text-primary">
              <a href="#"><FaFacebook className="size-6" /></a>
            </li>
          </ul>
        </div>

        {/* Right: Navigation Sections */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm text-muted-foreground justify-center">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="mb-4 font-bold text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="hover:text-primary">
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="mt-14 border-t pt-6 text-center text-sm text-muted-foreground flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <p>© 2025 Brixta by MyCoco. All rights reserved.</p>
        <ul className="flex justify-center gap-4">
          <li className="hover:text-primary">
            <a href="/termsconditions">Terms and Conditions</a>
          </li>
          <li className="hover:text-primary">
            <a href="/privacypolicy">Privacy Policy</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}


