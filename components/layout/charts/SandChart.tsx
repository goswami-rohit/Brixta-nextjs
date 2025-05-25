//"use client";

import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";
import { format } from "date-fns";
import { ChartContainer, ChartTooltipContent, } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

interface PriceData {
  date: Date;
  price: number;
}

interface SandPriceChartProps {
  selectedCity: string;
}

const sandChartConfig = {
  price: {
    label: "Price",
    color: "yellow", // You can choose a different color
  },
};

export default function SandPriceChart({ selectedCity }: SandPriceChartProps) {
  const [chartData, setChartData] = React.useState<PriceData[]>([]);
  const supabase = createClient();

  React.useEffect(() => {
    async function fetchSandData() {
      try {
        const { data, error } = await supabase
          .from('Sand-GHY') // Updated table name for Sand
          .select('Date, Price')
          .eq('Location', selectedCity.toLowerCase())
          .order('Date', { ascending: true });

        if (error) {
          console.error('Error fetching sand prices:', error);
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

    fetchSandData();
  }, [selectedCity, supabase]);

  const latestSandPrice = React.useMemo(() => {
    if (chartData.length > 0) {
      return chartData[chartData.length - 1].price;
    }
    return 'N/A';
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col lg:text-4xl justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Sand Price Chart - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</CardTitle>
        </div>
        <div className="flex items-center px-6 py-4 sm:px-8 sm:py-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-xs text-muted-foreground">
              Latest Price ({selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)})
            </span>
            <span className="text-xl font-bold leading-none lg:text-3xl sm:text-2xl">
              ₹{latestSandPrice.toLocaleString()}/cft
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={sandChartConfig}
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
              stroke={sandChartConfig?.price?.color}
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