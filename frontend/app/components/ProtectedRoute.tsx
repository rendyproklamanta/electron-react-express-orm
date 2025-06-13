import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { checkAuthStatus } from "../store/authSlice"
import { RootState } from "../store/store"
import { useAppDispatch } from "../store/hooks"

const ProtectedRoute = () => {
   const dispatch = useAppDispatch()
   const location = useLocation()

   const { isAuthenticated, isLoading } = useSelector(
      (state: RootState) => state.auth
   );

   useEffect(() => {
      dispatch(checkAuthStatus())
   }, [dispatch])

   // Show loading state while checking authentication
   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      )
   }

   // Redirect to login if not authenticated
   if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />
   }

   // Render child routes if authenticated
   return <Outlet />
}

export default ProtectedRoute
