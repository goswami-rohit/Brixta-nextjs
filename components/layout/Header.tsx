"use client";

import * as React from "react";
import Link from "next/link";
//import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  //NavigationMenu,
  // NavigationMenuContent,
  //NavigationMenuItem,
  NavigationMenuLink,
  //NavigationMenuList,
  // NavigationMenuTrigger,
  //navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { FaBars } from "react-icons/fa";


export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header
      className="w-full mx-auto flex items-center justify-between p-4 pt-10 shadow-md relative z-50"
      style={{
        background: "linear-gradient(to bottom, #08337a 0%, #121212 60%, #0d0d0d 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center pl-2 flex-shrink-0">
        <Link href="/" className="inline-flex flex-col items-start"> {/* Changed to flex-col to stack Brixta and My Coco */}
          {/* Brixta text as the main logo */}
          <h1 className="font-bold text-blue-600 tracking-tight text-xl sm:text-2xl md:text-3xl relative inline-flex items-baseline">
            Brixta
           <span className="absolute inset-0 bg-blue-500 opacity-20 rounded-md mix-blend-overlay"></span>
          </h1>
          {/* "by My Coco" tagline */}
          <p className="text-white text-xs sm:text-sm normal-case opacity-80 -mt-0.5"> {/* Adjusted font size and negative margin for spacing */}
            by <span className="font-semibold text-blue-200">My Coco</span>
          </p>
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-center w-full">
        <nav className="flex gap-6 text-white text-lg font-bolder">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl border border-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] transition hover:shadow-[0_0_12px_4px_rgba(59,130,246,0.8)]"
          >
            Home
          </Link>
          {/* <Link
            href="/sellers"
            className="px-4 py-2 rounded-xl border border-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] transition hover:shadow-[0_0_12px_4px_rgba(59,130,246,0.8)]"
          >
            Sellers
          </Link> */}
          <Link
            href="#footer"
            className="px-4 py-2 rounded-xl border border-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] transition hover:shadow-[0_0_12px_4px_rgba(59,130,246,0.8)]"
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 rounded-xl border border-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] transition hover:shadow-[0_0_12px_4px_rgba(59,130,246,0.8)]"
          >
            About
          </Link>

        </nav>
      </div>

      {/* Hamburger Icon - Mobile Only */}
      <div className="md:hidden pr-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full right-4 text-white font-semibold text-base bg-[#0f172a] px-4 py-2 rounded-xl border border-blue-500 
       shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] transition hover:shadow-[0_0_12px_4px_rgba(59,130,246,0.8)]">
          <ul className="space-y-2">
            <li>
              <Link href="/" className="block hover:text-cyan-300 transition-colors duration-200">
                Home
              </Link>
            </li>
            {/* <li>
              <Link href="/sellers" className="block hover:text-cyan-300 transition-colors duration-200">
                Sellers
              </Link>
            </li> */}
            <li>
              <Link href="#footer" className="block hover:text-cyan-300 transition-colors duration-200">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/about" className="block hover:text-cyan-300 transition-colors duration-200">
                About
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"