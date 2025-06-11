import Burger from "../components/Burger";
import { ChartAreaInteractive } from "../components/chart-area-interactive";
import { SectionCards } from "../components/section-cards";

export default function Grid() {
   return (
      <>
         <Burger breadcrumbs="Dashboard" />


         <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
               <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                     <ChartAreaInteractive />
                  </div>
                  {/* <DataTable data={data} /> */}
               </div>
            </div>
         </div>

         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            Hello, John Doe
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
               <div className="aspect-video rounded-xl bg-muted/100" />
               <div className="aspect-video rounded-xl bg-muted/100" />
               <div className="aspect-video rounded-xl bg-muted/100" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/100 md:min-h-min" />
         </div>
      </>
   )
}
