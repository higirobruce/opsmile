'use client'
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { redirect, useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { supabase } from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"
import { toast, Toaster } from "sonner"

export default function SignIn() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const id = useId()
  // const handleSignIn = async () => {
  //   let { data, error } = await supabase.auth.signInWithPassword({
  //     email: 'higirobru@gmail.com',
  //     password: 'nLrSPgCCmlppTbzUOqLq'
  //   })
  //   if (error) {
  //     console.log('Failed to log in', error)
  //   }

  //   if (data) {
  //     supabase.auth.setSession({
  //       access_token: data.session?.access_token ?? '',
  //       refresh_token: data.session?.refresh_token ?? '',
  //     })
  //     router.push('/dashboard')
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error } = await signIn(email, password);

      if (error) throw error;
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error)
    } finally {
    }
  };

  return (
    <Dialog>
      <Toaster/>
      <DialogTrigger asChild>
        <Button variant="gradient">Sign in</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          {/* <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div> */}
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                placeholder="hi@yourcompany.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-remember`} />
              <Label
                htmlFor={`${id}-remember`}
                className="text-muted-foreground font-normal"
              >
                Remember me
              </Label>
            </div>
            <a className="text-sm underline hover:no-underline" href="#">
              Forgot password?
            </a>
          </div>
          <Button type="submit" className="w-full" disabled={!email || !password || loading}>
            {loading && <Loader2 size="sm"/>}
            Sign in
          </Button>
        </form>

        {/* <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <Button variant="outline">Login with Google</Button> */}
      </DialogContent>
    </Dialog>
  )
}
