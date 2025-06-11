import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function BoxPlotChartDemo() {
   const options = {
      chart: {
         type: "boxPlot" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444"],
      title: {
         text: "Statistical Distribution",
      },
      xaxis: {
         type: "category" as const,
         categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
      plotOptions: {
         boxPlot: {
            colors: {
               upper: "#3b82f6",
               lower: "#ef4444",
            },
         },
      },
   }

   const series = [
      {
         name: "Box",
         type: "boxPlot" as const,
         data: [
            {
               x: "Jan",
               y: [54, 66, 69, 75, 88],
            },
            {
               x: "Feb",
               y: [43, 65, 69, 76, 81],
            },
            {
               x: "Mar",
               y: [31, 39, 45, 51, 59],
            },
            {
               x: "Apr",
               y: [39, 46, 55, 65, 71],
            },
            {
               x: "May",
               y: [29, 31, 35, 39, 44],
            },
            {
               x: "Jun",
               y: [41, 49, 58, 61, 67],
            },
         ],
      },
   ]

   return (
      <ChartWrapper title="Box Plot Chart" description="Statistical data distribution">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="boxPlot" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
