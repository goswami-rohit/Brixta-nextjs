// components/LeadsPageContent.tsx
"use client";

import React, { useState, useEffect, startTransition, useMemo } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import SellersTable from "@/components/layout/sellersPageLogic/SellerTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
//import { FaArrowDown } from "react-icons/fa";

const BrickPriceChart = dynamic(() => import("@/components/layout/charts/BrickChart"), { ssr: false });
const CementPriceChart = dynamic(() => import("@/components/layout/charts/CementChart"), { ssr: false });
const SandPriceChart = dynamic(() => import("@/components/layout/charts/SandChart"), { ssr: false });
const StonePriceChart = dynamic(() => import("@/components/layout/charts/StoneChart"), { ssr: false });
const TMTBarPriceChart = dynamic(() => import("@/components/layout/charts/TMTBarChart"), { ssr: false });

interface Seller {
  id: string;
  locations: {
    LocName: string;
  };
  Price: number;
  Name: string;
  "Shop Address": string;
  "Phone Num": string;
}

const LeadsPageContent = () => {
  const [selectedItem, setSelectedItem] = useState<string>("Bricks-seller-GHY");
  const [selectedCity, setSelectedCity] = useState<string>("guwahati");
  const [sellersData, setSellersData] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const supabase = createClient();

  const itemOptions = useMemo(() => [
    { value: "Bricks-seller-GHY", label: "Bricks" },
    { value: "Sand-seller-GHY", label: "Sand" },
    { value: "Stone-seller-GHY", label: "Stone" },
    { value: "TMTBar-seller-GHY", label: "TMT Bars" },
    { value: "Cement-seller-GHY", label: "Cement" },
  ], []);

  const cityOptions = useMemo(() => [
    { value: "guwahati", label: "Guwahati" },
  ], []);

  useEffect(() => {
    const fetchSellers = async () => {
      if (!selectedItem || !selectedCity) return;
      setLoading(true);

      try {
        const { data: locationData, error: locationError } = await supabase
          .from("All-Locations")
          .select("id")
          .eq("LocName", selectedCity.toLowerCase())
          .single();

        if (locationError || !locationData) {
          console.error("Location fetch error", locationError);
          setSellersData([]);
          return;
        }

        const locationId = locationData.id;

        const { data: sellers, error: sellersError } = await supabase
          .from(selectedItem)
          .select(`id, Name, Price, "Shop Address", "Phone Num", locations:Location_id(id, LocName)`) // foreign key join
          .eq("Location_id", locationId)
          .order("Price", { ascending: true });

        if (sellersError || !sellers) {
          console.error("Sellers fetch error", sellersError);
          setSellersData([]);
        } else {
          // Fix for nested array issue: flatten locations if needed
          const formattedSellers = sellers.map((seller) => ({
            ...seller,
            locations: Array.isArray(seller.locations) ? seller.locations[0] : seller.locations,
          }));
          setSellersData(formattedSellers);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setSellersData([]);
      } finally {
        setLoading(false);
      }
    };

    startTransition(fetchSellers);
  }, [selectedItem, selectedCity, supabase]);

  const renderChart = () => {
    switch (selectedItem) {
      case "Bricks-seller-GHY": return <BrickPriceChart selectedCity={selectedCity} />;
      case "Cement-seller-GHY": return <CementPriceChart selectedCity={selectedCity} />;
      case "Sand-seller-GHY": return <SandPriceChart selectedCity={selectedCity} />;
      case "Stone-seller-GHY": return <StonePriceChart selectedCity={selectedCity} />;
      case "TMTBar-seller-GHY": return <TMTBarPriceChart selectedCity={selectedCity} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 px-4">
      <div className="mb-8 pt-4 flex flex-wrap gap-6 justify-center">
        <div>
          <Label>Select Item</Label>
          <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Items</SelectLabel>
                {itemOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Select City</Label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cities</SelectLabel>
                {cityOptions.map((city) => (
                  <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {renderChart()}

      {loading ? (
        <div className="text-white text-center py-10">Loading sellers...</div>
      ) : (
        <SellersTable sellers={sellersData} />
      )}
    </div>
  );
};

export default LeadsPageContent;
