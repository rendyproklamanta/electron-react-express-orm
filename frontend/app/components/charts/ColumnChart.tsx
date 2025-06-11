import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function ColumnChartDemo() {
   const options = {
      chart: {
         type: "bar" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444"],
      plotOptions: {
         bar: {
            horizontal: false,
            columnWidth: "55%",
         },
      },
      dataLabels: {
         enabled: false,
      },
      stroke: {
         show: true,
         width: 2,
         colors: ["transparent"],
      },
      xaxis: {
         categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      },
      yaxis: {
         title: {
            text: "$ (thousands)",
         },
      },
      fill: {
         opacity: 1,
      },
      tooltip: {
         y: {
            formatter: (val: number) => "$ " + val + " thousands",
         },
      },
      legend: {
         position: "top" as const,
      },
      grid: {
         borderColor: "#e5e7eb",
      },
   }

   const series = [
      {
         name: "Net Profit",
         data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
         name: "Revenue",
         data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
   ]

   return (
      <ChartWrapper title="Column Chart" description="Vertical column chart with multiple series">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="bar" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
