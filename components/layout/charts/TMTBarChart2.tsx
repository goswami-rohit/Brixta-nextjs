//"use client";

import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";
import { format } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

interface PriceData {
  date: Date;
  price: number;
}

interface TMTBarPriceChartProps {
  selectedCity: string;
  selectedCompanyId?: string; 
  selectedCompanyName?: string; 
  selectedDiameter?: number | string;   
}

const tmtBarChartConfig = {
  price: {
    label: "Price",
    color: "green", // Another color option
  },
};

export default function TMTBarPriceChart({ selectedCity, selectedCompanyId, selectedCompanyName, selectedDiameter }: TMTBarPriceChartProps) {
  const [chartData, setChartData] = React.useState<PriceData[]>([]);
  const supabase = createClient();

  React.useEffect(() => {
    async function fetchTMTBarData() {
      try {
        let query = supabase
          .from('TMTBar-GHY') // Updated table name for TMTBar
          .select('Date, Price')
          .eq('Location', selectedCity.toLowerCase());

        if (selectedCompanyId) {
          query = query.eq('Company_id', selectedCompanyId);
        }
        if (selectedDiameter) {
          query = query.eq('Diameter_mm', selectedDiameter);
        }

        const { data, error } = await query.order('Date', { ascending: true });

        if (error) {
          console.error('Error fetching tmtbar prices:', error);
          return;
        }

        if (data) {
          const formattedData: PriceData[] = data.map((item) => ({
            date: new Date(item.Date), // 👈 convert to real Date object
            price: item.Price,
          }));
          setChartData(formattedData);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('An unexpected error occurred:', error.message);
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    }

    fetchTMTBarData();
  }, [selectedCity, selectedCompanyId, selectedDiameter, supabase]);

  const latestTMTBarPrice = React.useMemo(() => {
    if (chartData.length > 0) {
      return chartData[chartData.length - 1].price;
    }
    return 'N/A';
  }, [chartData]);

  const chartTitleParts: string[] = [`TMT Bar Price Chart - ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`];
  if (selectedCompanyId) {
    // You might want to fetch the company name based on the ID here if needed for the title
    chartTitleParts.push(`(${selectedCompanyName})`); 
  }
  if (selectedDiameter) {
    chartTitleParts.push(`- ${selectedDiameter}mm`);
  }
  const chartTitle = chartTitleParts.join(" ");

  const latestPriceTextParts: string[] = [`Latest Price (${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)})`];
  if (selectedCompanyId) {
    latestPriceTextParts.push(`(${selectedCompanyName})`);
  }
  if (selectedDiameter) {
    latestPriceTextParts.push(`- ${selectedDiameter}mm`);
  }
  const latestPriceText = latestPriceTextParts.join(" ");

  return (
    <Card className="flex w-full sm:w-full md:w-4/5 lg:w-full">
      <CardHeader className="flex items-center justify-between space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col lg:text-4xl justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{chartTitle}</CardTitle>
        </div>
        <div className="flex items-center px-6 py-4 sm:px-8 sm:py-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-xs text-muted-foreground">
              {latestPriceText}
            </span>
            <span className="text-xl font-bold leading-none lg:text-3xl sm:text-2xl">
              ₹{latestTMTBarPrice.toLocaleString()}/pc
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={tmtBarChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 20,
              bottom: 20,
              top: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => format(new Date(value), "MMM dd")}
              label={{ value: "Date", offset: -5, position: "bottom",
                style: {fontWeight: 600,fontSize: 14,fill: "#ffffff",} }}

            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: "Price (₹)", offset: 10, position: "left", angle: -90,
                style: {fontWeight: 600,fontSize: 14,fill: "#ffffff",} }}

            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="price"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return isNaN(date.getTime()) ? "" : format(date, "yyyy-MM-dd");
                  }}
                  formatter={(value) => [`₹${value}`]}
                />
              }
            />
            <Line
              dataKey="price"
              type="monotone"
              stroke={tmtBarChartConfig?.price?.color}
              strokeWidth={3}
              dot={true}
              name="Price"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}