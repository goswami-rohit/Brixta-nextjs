"use client";

import React, { useState, useEffect, startTransition, useMemo } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import SellersTable from "@/components/layout/sellersPageLogic/Sellertable3";
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
import { SupabaseClient } from "@supabase/supabase-js";

const BrickPriceChart = dynamic(() => import("@/components/layout/charts/BrickChart"), { ssr: false });
const SandPriceChart = dynamic(() => import("@/components/layout/charts/SandChart"), { ssr: false });
const StonePriceChart = dynamic(() => import("@/components/layout/charts/StoneChart"), { ssr: false });
const TMTBarPriceChart = dynamic(() => import("@/components/layout/charts/TMTBarChart2"), { ssr: false });
const CementPriceChart = dynamic(() => import("@/components/layout/charts/CementChart2"), { ssr: false });

interface Seller {
  id: string;
  locations: { LocName: string };
  Price: number;
  Name: string;
  "Shop Address": string;
  "Phone Num": string;
  company_id?: string;
  Locality: string; // Add Locality to the Seller interface
}

interface Company {
  Company_id: string;
  Company_name: string;
  Diameter: number;
}

const SellersPageContent = () => {
  const [selectedItem, setSelectedItem] = useState<string>("TMTBar-seller-GHY");
  const [selectedCity, setSelectedCity] = useState<string>("guwahati");
  const [selectedLocality, setSelectedLocality] = useState<string>("");
  const [availableLocalities, setAvailableLocalities] = useState<string[]>([]);

  const [sellersData, setSellersData] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCementCompanyId, setSelectedCementCompanyId] = useState<string>("");
  const [selectedTmtCompanyId, setSelectedTmtCompanyId] = useState<string>("");
  const [cementCompanies, setCementCompanies] = useState<Company[]>([]);
  const [tmtCompanies, setTmtCompanies] = useState<Company[]>([]);
  const [selectedTmtDiameter, setSelectedTmtDiameter] = useState<string>("");
  const supabase = createClient();

  const itemOptions = useMemo(() => [
    // { value: "Bricks-seller-GHY", label: "Bricks" },
    // { value: "Sand-seller-GHY", label: "Sand" },
    // { value: "Stone-seller-GHY", label: "Stone" },
    { value: "TMTBar-seller-GHY", label: "TMT Bars" },
    { value: "Cement-seller-GHY", label: "Cement" },
  ], []);

  const cityOptions = useMemo(() => [
    { value: "guwahati", label: "Guwahati" },
    // Add more cities here as needed
  ], []);

  const tmtDiameterOptions = useMemo(() => [
    { value: 5.5, label: "5.5mm" },
    { value: 6, label: "6mm" },
    { value: 8, label: "8mm" },
    { value: 10, label: "10mm" },
    { value: 12, label: "12mm" },
    { value: 16, label: "16mm" },
    { value: 20, label: "20mm" },
    { value: 25, label: "25mm" },
    { value: 28, label: "28mm" },
    { value: 32, label: "32mm" },
  ], []);

  const selectedTmtCompanyName = useMemo(() => {
    return tmtCompanies.find(c => c.Company_id === selectedTmtCompanyId)?.Company_name;
  }, [selectedTmtCompanyId, tmtCompanies]);

  useEffect(() => {
    async function fetchCementCompanies() {
      const { data, error } = await supabase
        .from('Cement-Companies')
        .select('Company_id, Company_name')
        .returns<Company[]>();

      if (data) {
        setCementCompanies(data);
      } else if (error) {
        console.error("Error fetching Cement companies:", error);
      }
    }

    async function fetchTmtCompanies() {
      const { data, error } = await supabase
        .from('TMT-Companies')
        .select('Company_id, Company_name')
        .returns<Company[]>();

      if (data) {
        setTmtCompanies(data);
      } else if (error) {
        console.error("Error fetching TMT companies:", error);
      }
    }

    fetchCementCompanies();
    fetchTmtCompanies();
  }, [supabase]);

  useEffect(() => {
    const fetchLocalities = async (selectedCity: string, selectedItem: string, supabase: SupabaseClient) => {
      if (selectedCity && selectedItem) {
        setAvailableLocalities([]);
        const { data: locationData, error: locationError } = await supabase
          .from("All-Locations")
          .select("id")
          .eq("LocName", selectedCity.toLowerCase())
          .maybeSingle();


        if (locationData) {
          const { data: localitiesData, error: localitiesError } = await supabase
            .from(selectedItem)
            .select('Locality')
            .eq('Location_id', locationData.id)
            .order('Locality');

          if (localitiesData) {
            const distinctLocalities = [...new Set(localitiesData.map((l: { Locality: string }) => l.Locality))].sort();
            setAvailableLocalities(['All Localities', ...distinctLocalities]);
          } else if (localitiesError) {
            console.error("Error fetching localities:", localitiesError);
          }
        } else if (locationError) {
          console.error("Error fetching location ID:", locationError);
        }
      }
      setSelectedLocality("");
    };

    fetchLocalities(selectedCity, selectedItem, supabase);
  }, [selectedCity, selectedItem, supabase]);

  useEffect(() => {
    const fetchSellers = async () => {
      if (!selectedItem || !selectedCity) return;
      setLoading(true);

      try {
        const { data: locationData, error: locationError } = await supabase
          .from("All-Locations")
          .select("id")
          .eq("LocName", selectedCity.toLowerCase())
          .maybeSingle();

        if (locationError || !locationData) {
          console.error("Location fetch error", locationError);
          setSellersData([]);
          return;
        }

        const locationId = locationData.id;
        let query = supabase
          .from(selectedItem)
          .select(`id, Name, Price, "Shop Address", "Phone Num", Locality,
             locations:Location_id(id, LocName)`)
          .eq("Location_id", locationId)
          .order("Price", { ascending: true });

        if (selectedItem === "Cement-seller-GHY" && selectedCementCompanyId) {
          query = query.eq("Company_id", selectedCementCompanyId);
        }
        if (selectedItem === "TMTBar-seller-GHY" && selectedTmtCompanyId) {
          query = query.eq("Company_id", selectedTmtCompanyId);
        }
        if (selectedLocality && selectedLocality !== 'All Localities') {
          query = query.eq("Locality", selectedLocality);
        }

        const { data: sellers, error: sellersError } = await query;

        if (sellersError || !sellers) {
          console.error("Sellers fetch error", sellersError);
          setSellersData([]);
        } else {
          const formattedSellers = sellers.map((seller) => ({
            ...seller,
            locations: Array.isArray(seller.locations) ? seller.locations[0] : seller.locations,
            Locality: seller.Locality,
          }));
          setSellersData(formattedSellers as Seller[]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setSellersData([]);
      } finally {
        setLoading(false);
      }
    };
    startTransition(fetchSellers);
  }, [selectedItem, selectedCity, selectedCementCompanyId, selectedTmtCompanyId, selectedLocality, supabase]);

  const handleItemChange = (value: string) => {
    setSelectedItem(value);
    setSelectedCementCompanyId("");
    setSelectedTmtCompanyId("");
    setSelectedTmtDiameter("");
    setSelectedLocality("");
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
  };

  const handleLocalityChange = (value: string) => {
    setSelectedLocality(value);
  };

  const handleCementCompanyChange = (value: string) => {
    setSelectedCementCompanyId(value);
  };

  const handleTmtCompanyChange = (value: string) => {
    setSelectedTmtCompanyId(value);
  };

  const handleTmtDiameterChange = (value: string) => {
    setSelectedTmtDiameter(value);
  };

  const renderChart = () => {
    switch (selectedItem) {
      case "Bricks-seller-GHY": return <BrickPriceChart selectedCity={selectedCity} />;
      case "Sand-seller-GHY": return <SandPriceChart selectedCity={selectedCity} />;
      case "Stone-seller-GHY": return <StonePriceChart selectedCity={selectedCity} />;
      case "Cement-seller-GHY": return <CementPriceChart selectedCity={selectedCity} selectedCompanyId={selectedCementCompanyId} />;
      case "TMTBar-seller-GHY": return <TMTBarPriceChart selectedCity={selectedCity} selectedCompanyId={selectedTmtCompanyId} selectedCompanyName={selectedTmtCompanyName} selectedDiameter={selectedTmtDiameter}/>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 px-4">
      <div className="mb-8 pt-4 flex flex-wrap gap-6 justify-center items-end">
        {/* Items selector */}
        <div className="flex flex-col items-center">
          <Label className="mb-1">Select Item</Label>
          <Select value={selectedItem} onValueChange={handleItemChange}>
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

        {/* City selector */}
        <div className="flex flex-col items-center">
          <Label className="mb-1">Select City</Label>
          <Select value={selectedCity} onValueChange={handleCityChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cities</SelectLabel>
                {cityOptions.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Locality selector (appears after a city is selected) */}
        {selectedCity && availableLocalities.length > 0 && (
          <div className="flex flex-col items-center">
            <Label className="mb-1">Select Locality<br className="hidden sm:block" />(in seller table)</Label>
            <Select value={selectedLocality} onValueChange={handleLocalityChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Localities" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Localities</SelectLabel>
                  {availableLocalities.map((locality) => (
                    <SelectItem key={locality} value={locality}>{locality}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Cement company selector */}
        {selectedItem === "Cement-seller-GHY" && (
          <div className="flex flex-col items-center">
            <Label className="mb-1">Select Cement Company</Label>
            <Select
              value={selectedCementCompanyId}
              onValueChange={handleCementCompanyChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Cement Company" />
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

        {/* TMT company selector */}
        {selectedItem === "TMTBar-seller-GHY" && (
          <div className="flex flex-col items-center">
            <Label className="mb-1">Select TMT Company</Label>
            <Select
              value={selectedTmtCompanyId}
              onValueChange={handleTmtCompanyChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select TMT Company" />
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

        {/* TMT Diameter selector */}
        {selectedItem === "TMTBar-seller-GHY" && (
          <div className="flex flex-col items-center">
            <Label className="mb-1">Select TMT Diameter</Label>
            <Select
              value={selectedTmtDiameter?.toString()}
              onValueChange={handleTmtDiameterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Diameter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Diameters (for chart)</SelectLabel>
                  {tmtDiameterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
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

export default SellersPageContent;