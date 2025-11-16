'use client'
import { useAuth } from '@/app/context/AuthContext'
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Link from 'next/link'
import { useId, useState } from 'react'
import { toast, Toaster } from 'sonner'

export default function LoginPage() {
    const { signIn, loading } = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const id = useId()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
        } catch (error: any) {
            toast.error(error)
        } finally {
        }
    };
    return (
        <section className="flex min-h-screen  px-4 py-16 md:py-32 dark:bg-transparent">
            <Toaster />
            <form
                action=""
                onSubmit={handleSubmit}
                className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div className='flex flex-col items-center'>
                        <Link
                            href="/"
                            aria-label="go home">
                            <Image src='/logo.png' alt='logo' width={80} height={80} />
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to SurgeryUpp</h1>
                        <p className="text-sm">Welcome back! Sign in to continue</p>
                    </div>


                    <hr className="my-4 border-dashed" />

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm">
                                Username
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="pwd"
                                    className="text-sm">
                                    Password
                                </Label>
                                <Button
                                    asChild
                                    variant="link"
                                    size="sm">
                                    <Link
                                        href="#"
                                        className="link intent-info variant-ghost text-sm">
                                        Forgot your Password ?
                                    </Link>
                                </Button>
                            </div>
                            <Input
                                type="password"
                                required
                                name="pwd"
                                id="pwd"
                                className="input sz-md variant-mixed"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button className="w-full" type="submit" disabled={loading}>Sign In</Button>
                    </div>
                </div>

                {/* <div className="bg-muted/30 rounded-(--radius) border p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Don't have an account ?
                        <Button
                            asChild
                            variant="link"
                            className="px-2">
                            <Link href="#">Create account</Link>
                        </Button>
                    </p>
                </div> */}
            </form>
        </section>
    )
}
