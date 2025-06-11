import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

const API_URL = 'http://localhost:3000'


// Types

export interface AuthState {
   user: User | null
   token: string | null
   isLoading: boolean
   error: string | null
   isAuthenticated: boolean
}

interface User {
   id: number
   email: string
   name: string
   avatar: string
}

interface LoginPayload {
   email: string
   password: string
}

interface AuthResponse {
   user: User
   token: string
}

// Thunks
export const loginUser = createAsyncThunk<
   AuthResponse,             // Return type
   LoginPayload,             // Argument type
   { rejectValue: string }   // Rejection type
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
   try {
      const response = await fetch(`${API_URL}/auth/login`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
         throw new Error("Invalid credentials")
      }

      const data = await response.json()

      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("user", JSON.stringify(data.user))

      return {
         token: data.accessToken,
         user: data.user,
      }
   } catch (error: any) {
      console.warn("API not available, using mock authentication:", error.message)

      if (email === "user@example.com" && password === "password") {
         const mockData: AuthResponse = {
            token: "mock-jwt-token-" + Date.now(),
            user: {
               id: 1,
               email,
               name: "John Doe",
               avatar: "/placeholder.svg?height=32&width=32",
            },
         }

         localStorage.setItem("token", mockData.token)
         localStorage.setItem("user", JSON.stringify(mockData.user))

         return mockData
      } else {
         return rejectWithValue("Invalid credentials")
      }
   }
})

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
   localStorage.removeItem("token")
   localStorage.removeItem("user")
   return null
})

export const checkAuthStatus = createAsyncThunk<AuthResponse | null>(
   "auth/checkAuthStatus",
   async () => {
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")

      if (token && user) {
         return {
            token,
            user: JSON.parse(user),
         }
      }

      return null
   }
)

// Slice
const initialState: AuthState = {
   user: null,
   token: null,
   isLoading: false,
   error: null,
   isAuthenticated: false,
}

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      clearError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload ?? "Login failed"
            state.isAuthenticated = false
         })
         .addCase(logoutUser.fulfilled, (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
         })
         .addCase(checkAuthStatus.fulfilled, (state, action) => {
            if (action.payload) {
               state.user = action.payload.user
               state.token = action.payload.token
               state.isAuthenticated = true
            }
         })
   },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
