"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { Session, User, WeakPassword } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"

type AuthContextType = {
    user: User | null
    session: Session | null
    loading: boolean
    signUp: (email: string, password: string) => Promise<{
        error: string | null, data: {
            user: User | null;
            session: Session | null;
        } | {
            user: null;
            session: null;
        }
    }>
    signIn: (email: string, password: string) => Promise<{
        error: string | null, data: {
            user: User;
            session: Session;
            weakPassword?: WeakPassword;
        } | {
            user: null;
            session: null;
            weakPassword?: null;
        }
    }>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<{ error: string | null }>
    updateProfile: (data: { [key: string]: any }) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get current session on mount
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
            setUser(data.session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signUp = async (email: string, password: string) => {
        const { error, data } = await supabase.auth.signUp({ email, password })
        return { error: error?.message || null, data }
    }

    const signIn = async (email: string, password: string) => {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password })
        return { error: error?.message || null, data }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        return { error: error?.message || null }
    }

    const updateProfile = async (data: { [key: string]: any }) => {
        const { error } = await supabase.auth.updateUser(data)
        return { error: error?.message || null }
    }

    const value: AuthContextType = {
        user,
        session,
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