import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { loginUser, clearError } from "../store/authSlice"
import { Loader2 } from "lucide-react"
import { RootState } from "../store/store"
import { useAppDispatch } from "../store/hooks"

interface FormData {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { isAuthenticated, error, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      // const from = location.state?.from?.pathname || "/"
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login to continue to dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} >
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to=""
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="password"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-200 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-600">{error}!</p>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>

              <div className="mt-1 p-4 bg-muted rounded-lg">
                <p className="text-sm text-white-800 font-medium mb-2">Demo Credential</p>
                <p className="text-sm text-white-700">Email: user@example.com</p>
                <p className="text-sm text-white-700">Password: password</p>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link to="">Terms of Service</Link>{" "}
        and <Link to="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}
