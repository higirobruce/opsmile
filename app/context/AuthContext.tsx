"use client"

import { set } from "date-fns"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
}

interface AuthResponse {
    access_token: string
    user: User
}

interface ErrorResponse {
    message: string
    error: string
    statusCode: number
}

type AuthContextType = {
    user: User | null
    token: string | null
    loading: boolean
    signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: string | null, data: AuthResponse | null }>
    signIn: (email: string, password: string) => Promise<{ error: string | null, data: AuthResponse | null }>
    signOut: () => void
    resetPassword: (email: string) => Promise<{ error: string | null }>
    updateProfile: (data: Partial<User>) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for stored authentication on mount
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        
        setLoading(false)
    }, [])

    const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, firstName, lastName, username: email.slice(0, email.indexOf('@')) }),
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                return { error: data.message, data: null }
            }

            // Store authentication data
            localStorage.setItem('token', data.access_token)
            localStorage.setItem('user', JSON.stringify(data.user))
            
            setToken(data.access_token)
            setUser(data.user)
            
            setLoading(false)
            return { error: null, data }
        } catch (error) {7
            setLoading(false)
            return { error: 'An error occurred during sign up', data: null }
        }
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                return { error: data.message, data: null }
            }

            // Store authentication data
            localStorage.setItem('token', data.access_token)
            localStorage.setItem('user', JSON.stringify(data.user))
            
            setToken(data.access_token)
            setUser(data.user)
            
            setLoading(false)
            return { error: null, data }
        } catch (error) {
            setLoading(false)
            return { error: 'An error occurred during sign in', data: null }
        }
    }

    const signOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    const resetPassword = async (email: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                return { error: data.message }
            }

            return { error: null }
        } catch (error) {
            return { error: 'An error occurred during password reset' }
        }
    }

    const updateProfile = async (data: Partial<User>) => {
        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            })
            
            const result = await response.json()
            
            if (!response.ok) {
                return { error: result.message }
            }

            // Update stored user data
            setUser({ ...user!, ...data })
            localStorage.setItem('user', JSON.stringify({ ...user!, ...data }))

            return { error: null }
        } catch (error) {
            return { error: 'An error occurred while updating profile' }
        }
    }

    const value: AuthContextType = {
        user,
        token,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}