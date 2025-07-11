import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'


export default function Burger({ breadcrumbs }: { breadcrumbs?: string }) {
   return (
      <>
         <header id="scrollable-container" className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
               <SidebarTrigger className="-ml-1" />
               <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
               />
               <h1 className="text-base font-medium">{breadcrumbs}</h1>
            </div>
         </header>
      </>
   )
}
