// components/layout/charts/ChartsSection.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Dynamically import charts
const BrickPriceChart = dynamic(() => import("@/components/layout/charts/BrickChart"), { ssr: false });
const SandPriceChart = dynamic(() => import("@/components/layout/charts/SandChart"), { ssr: false });
const StonePriceChart = dynamic(() => import("@/components/layout/charts/StoneChart"), { ssr: false });
const TMTBarPriceChart = dynamic(() => import("@/components/layout/charts/TMTBarChart"), { ssr: false });
const CementPriceChart = dynamic(() => import("@/components/layout/charts/CementChart"), { ssr: false });

export default function ChartsSection() {
  const items = [
    { value: "bricks", label: "Bricks" },
    { value: "sand", label: "Sand" },
    { value: "stone", label: "Stone" },
    { value: "tmt", label: "TMT Bars" },
    { value: "cement", label: "Cement" },
  ];

  const cities = [
    { value: "guwahati", label: "Guwahati" },
    // Add more cities as needed
  ];

  const [selectedItem, setSelectedItem] = useState<string>("bricks");
  const [selectedCity, setSelectedCity] = useState<string>("guwahati");

  const renderChart = () => {
    switch (selectedItem) {
      case "bricks":
        return <BrickPriceChart selectedCity={selectedCity} />;
      case "sand":
        return <SandPriceChart selectedCity={selectedCity} />;
      case "stone":
        return <StonePriceChart selectedCity={selectedCity} />;
      case "tmt":
        return <TMTBarPriceChart selectedCity={selectedCity} />;
      case "cement":
        return <CementPriceChart selectedCity={selectedCity} />;
      default:
        return (
          <Card>
            <CardContent>Please select an item to view the chart.</CardContent>
          </Card>
        );
    }
  };

  return (
    <section>
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="pt-10 pb-4 text-3xl sm:text-4xl font-extrabold text-center text-white tracking-tight mb-10 relative z-10">
          <span className="relative inline-block px-4">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-20 rounded-xl blur-md"></span>
            <span className="relative z-8">📈 Price Trends</span>
          </span>
        </h2>

        <div className="mb-8 pt-4 flex flex-wrap gap-6 justify-center">
          {/* Item Selection */}
          <div>
            <Label htmlFor="item-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Select Item
            </Label>
            <Select onValueChange={setSelectedItem} defaultValue={selectedItem}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Item" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Items</SelectLabel>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* City Selection */}
          <div>
            <Label htmlFor="city-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Select City
            </Label>
            <Select onValueChange={setSelectedCity} defaultValue={selectedCity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cities</SelectLabel>
                  {cities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Render Selected Chart */}
        {renderChart()}
      </div>
    </section>
  );
}
