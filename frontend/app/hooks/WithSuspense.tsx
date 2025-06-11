// WithSuspense.tsx
import { Suspense } from "react"
import { useLocation } from "react-router-dom"

export function WithSuspense({ children }: { children: React.ReactNode }) {
   const location = useLocation()
   return (
      <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
         {/* Force re-mount on route change */}
         <div key={location.key}>{children}</div>
      </Suspense>
   )
}