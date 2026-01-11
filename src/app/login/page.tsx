"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music2, Mail, Lock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { authClient } from "~/server/better-auth/client";

export default function Login() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isSignUp) {
                await authClient.signUp.email({
                    email,
                    password,
                    name,
                });
            } else {
                await authClient.signIn.email({
                    email,
                    password,
                });
            }
            router.push("/");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpotifyLogin = async () => {
        setIsLoading(true);
        try {
            await authClient.signIn.social({
                provider: "spotify",
                callbackURL: "/",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Spotify login failed");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center border-4 border-foreground bg-primary">
                        <Music2 className="size-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-[0.15em]">
                        OnePlaylist
                    </h1>
                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                        {isSignUp ? "Create your account" : "Sign in to continue"}
                    </p>
                </div>

                {/* OAuth Providers */}
                <Card className="border-2 border-foreground shadow-[6px_6px_0_var(--foreground)]">
                    <CardHeader className="border-b-2 border-foreground">
                        <CardTitle className="text-base font-black uppercase tracking-[0.25em]">
                            Connect with
                        </CardTitle>
                        <CardDescription className="text-xs uppercase tracking-[0.2em]">
                            Link your music services
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-6">
                        <Button
                            onClick={handleSpotifyLogin}
                            disabled={isLoading}
                            className="w-full font-black uppercase tracking-[0.25em] bg-primary text-primary-foreground h-12 shadow-[3px_3px_0_var(--foreground)] hover:shadow-[5px_5px_0_var(--foreground)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                        >
                            <Music2 className="mr-2 size-5" />
                            Continue with Spotify
                        </Button>
                    </CardContent>
                </Card>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-dashed border-foreground" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-background px-4 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                            Or
                        </span>
                    </div>
                </div>

                {/* Email/Password Form */}
                <Card className="border-2 border-foreground shadow-[6px_6px_0_var(--foreground)]">
                    <CardHeader className="border-b-2 border-foreground">
                        <CardTitle className="text-base font-black uppercase tracking-[0.25em]">
                            {isSignUp ? "Sign up" : "Sign in"}
                        </CardTitle>
                        <CardDescription className="text-xs uppercase tracking-[0.2em]">
                            Use your email and password
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            {isSignUp && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="YOUR NAME"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={isSignUp}
                                            className="border-2 border-foreground pl-10 font-semibold uppercase tracking-[0.2em] placeholder:text-xs"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="YOUR@EMAIL.COM"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="border-2 border-foreground pl-10 font-semibold uppercase tracking-[0.2em] placeholder:text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="border-2 border-foreground pl-10 font-semibold tracking-[0.2em]"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="border-2 border-destructive bg-destructive/10 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full font-black uppercase tracking-[0.25em] h-12 shadow-[3px_3px_0_var(--foreground)] hover:shadow-[5px_5px_0_var(--foreground)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                            >
                                {isLoading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
                            </Button>
                        </form>

                        <div className="border-t-2 border-dashed border-foreground pt-4 text-center">
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError(null);
                                }}
                                disabled={isLoading}
                                className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
