// components/layout/charts/ChartsSection.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import { createClient } from "@/utils/supabase/client";

// Dynamically import charts
const BrickPriceChart = dynamic(() => import("@/components/layout/charts/BrickChart"), { ssr: false });
const SandPriceChart = dynamic(() => import("@/components/layout/charts/SandChart"), { ssr: false });
const StonePriceChart = dynamic(() => import("@/components/layout/charts/StoneChart"), { ssr: false });
const TMTBarPriceChart = dynamic(() => import("@/components/layout/charts/TMTBarChart2"), { ssr: false });
const CementPriceChart = dynamic(() => import("@/components/layout/charts/CementChart2"), { ssr: false });

interface Company {
  Company_id: string;
  Company_name: string;
}

export default function ChartsSection() {
  const items = [
    // { value: "bricks", label: "Bricks" },
    // { value: "sand", label: "Sand" },
    // { value: "stone", label: "Stone" },
    { value: "tmt", label: "TMT Bars" },
    { value: "cement", label: "Cement" },
  ];

  const cities = [
    { value: "guwahati", label: "Guwahati" },
    // Add more cities as needed
  ];

  const tmtDiameters = [5.5, 6, 8, 10, 12, 16, 20, 25, 28, 32];
  const [tmtCompanies, setTmtCompanies] = useState<Company[]>([]);
  const [cementCompanies, setCementCompanies] = useState<Company[]>([]);

  const [selectedItem, setSelectedItem] = useState<string>("tmt");
  const [selectedCity, setSelectedCity] = useState<string>("guwahati");
  const [selectedTmtCompanyId, setSelectedTmtCompanyId] = useState<string>("");
  const [selectedTmtDiameter, setSelectedTmtDiameter] = useState<number>(0);
  const [selectedCementCompanyId, setSelectedCementCompanyId] = useState<string>("");

  const supabase = createClient();

  useEffect(() => {
    const fetchTmtCompanies = async () => {
      const { data, error } = await supabase
      .from('TMT-Companies')
      .select('Company_id, Company_name')
      .returns<Company[]>();

      if (data) {
        setTmtCompanies(data);
      } else if (error) {
        console.error("Error fetching TMT companies:", error);
      }
    };

    const fetchCementCompanies = async () => {
      const { data, error } = await supabase
      .from('Cement-Companies')
      .select('Company_id, Company_name')
      .returns<Company[]>();

      if (data) {
        setCementCompanies(data);
      } else if (error) {
        console.error("Error fetching Cement companies:", error);
      }
    };

    if (selectedItem === "tmt") {
      fetchTmtCompanies();
    } else {
      setTmtCompanies([]);
      setSelectedTmtCompanyId("");
      setSelectedTmtDiameter(0);
    }

    if (selectedItem === "cement") {
      fetchCementCompanies();
    } else {
      setCementCompanies([]);
      setSelectedCementCompanyId("");
    }
  }, [selectedItem, supabase]);

  const handleItemChange = (value: string) => {
    setSelectedItem(value);
    setSelectedTmtCompanyId("");
    setSelectedTmtDiameter(0);
    setSelectedCementCompanyId("");
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
  };

  const handleTmtCompanyChange = (value: string) => {
    setSelectedTmtCompanyId(value);
    setSelectedTmtDiameter(0);
  };

  const handleTmtDiameterChange = (value: string) => {
    setSelectedTmtDiameter(parseInt(value));
  };

  const handleCementCompanyChange = (value: string) => {
    setSelectedCementCompanyId(value);
  };

  const renderChart = () => {
    switch (selectedItem) {
      case "bricks":
        return <BrickPriceChart selectedCity={selectedCity} />;
      case "sand":
        return <SandPriceChart selectedCity={selectedCity} />;
      case "stone":
        return <StonePriceChart selectedCity={selectedCity} />;
      case "tmt":
        const selectedTmtCompanyName = tmtCompanies.find(
            (company) => company.Company_id === selectedTmtCompanyId
          )?.Company_name || "";
        
          return (
            <TMTBarPriceChart
              selectedCity={selectedCity}
              selectedCompanyId={selectedTmtCompanyId}
              selectedCompanyName={selectedTmtCompanyName}
              selectedDiameter={selectedTmtDiameter}
            />
          );
      case "cement":
        return <CementPriceChart 
                selectedCity={selectedCity}
                selectedCompanyId={selectedCementCompanyId}
                />;
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
            <Select onValueChange={handleItemChange} defaultValue={selectedItem}>
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
            <Select onValueChange={handleCityChange} defaultValue={selectedCity}>
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

          {/* TMT Bar Company Selection */}
          {selectedItem === "tmt" && (
            <div>
              <Label htmlFor="tmt-company-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Select Company
              </Label>
              <Select onValueChange={handleTmtCompanyChange} value={selectedTmtCompanyId} disabled={tmtCompanies.length === 0}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={tmtCompanies.length === 0 ? "Loading Companies..." : "Select Company"} />
                </SelectTrigger>
                <SelectContent>
                  {tmtCompanies.map((company) => (
                    <SelectItem key={company.Company_id} value={company.Company_id}>
                      {company.Company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* TMT Bar Diameter Selection */}
          {selectedItem === "tmt" && selectedTmtCompanyId && (
            <div>
              <Label htmlFor="tmt-diameter-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Select Diameter
              </Label>
              <Select onValueChange={handleTmtDiameterChange} value={selectedTmtDiameter !== null ? String(selectedTmtDiameter) : ""} disabled={tmtCompanies.length === 0}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Diameter" />
                </SelectTrigger>
                <SelectContent>
                  {tmtDiameters.map((diameter) => (
                    <SelectItem key={diameter} value={String(diameter)}>
                      {diameter}mm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Cement Company Selection */}
          {selectedItem === "cement" && (
            <div>
              <Label htmlFor="cement-company-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Select Company
              </Label>
              <Select onValueChange={handleCementCompanyChange} value={selectedCementCompanyId} disabled={cementCompanies.length === 0}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={cementCompanies.length === 0 ? "Loading Companies..." : "Select Company"} />
                </SelectTrigger>
                <SelectContent>
                  {cementCompanies.map((company) => (
                    <SelectItem key={company.Company_id} value={company.Company_id}>
                      {company.Company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Render Selected Chart */}
        {renderChart()}
      </div>
    </section>
  );
}