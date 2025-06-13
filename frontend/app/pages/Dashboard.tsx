import Burger from "../components/Burger";
import { ChartAreaInteractive } from "../components/chart-area-interactive";
import { SectionCards } from "../components/section-cards";

export default function Dashboard() {
   return (
      <>
         <Burger breadcrumbs="Dashboard" />

         <div className="@container/main py-4 md:py-6">
            <div className="pb-10">
               <div className="flex flex-col gap-4 md:gap-6 ">
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                     <ChartAreaInteractive />
                  </div>
                  <SectionCards />
               </div>
            </div>
         </div>
      </>
   )
}
