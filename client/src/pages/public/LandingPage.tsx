import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Link2, MessageSquareText, Code2, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
    const {user} =useAuth()
    return (
        <div className="min-h-screen bg-background text-text-primary">
            {/* Navbar */}

            <header className="border-b border-border-subtle">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-text-primary">
                            <Sparkles className="h-4 w-4 text-background"/>
                        </div>
                        <span className="text-[15px] font-medium">SpeakWell</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {!user ? (
                            <>
                                <Link
                            to="/login"
                            className="text-sm text-text-secondary transition hover:text-text-primary"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-md bg-text-primary px-4 py-2 text-sm font-medium text-background transition hover:bg-accent-hover"
                        >
                            Get started
                        </Link>
                            </>
                        ) : (
                             <Link
                            to="/dashboard"
                            className="rounded-md bg-text-primary px-4 py-2 text-sm font-medium text-background transition hover:bg-accent-hover"
                        >
                            Dashboard
                        </Link>   
                        )}
                    </div>
                </nav>
            </header>


            {/* Hero */}
            <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
                        <Sparkles className="h-3 w-3" />
                        AI-powered testimonial generation
                    </div>

                    <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                        Your clients are happy.
                        <br />
                        <span className="text-text-secondary">
                            They just don't know what to write.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-base text-text-secondary md:text-lg">
                        Share a link, your client answers 3 quick questions, and Speakwell's
                        AI turns it into a polished testimonial ready to embed anywhere
                        with one line of code.
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-3">
                        {user ? (
                            <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 rounded-md bg-text-primary px-5 py-2.5 text-sm font-medium text-background transition hover:bg-accent-hover"
                        >
                            Go to dashboard
                            <ArrowRight className="h-4 w-4"/>
                        </Link>

                        ) : (
                                <Link
                            to="/register"
                            className="inline-flex items-center gap-2 rounded-md bg-text-primary px-5 py-2.5 text-sm font-medium text-background transition hover:bg-accent-hover"
                        >
                            Start for free
                            <ArrowRight className="h-4 w-4"/>
                        </Link>

                        )}
                        <a href="#how-it-works"
                            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface">
                            See how it works
                            </a>
                    </div>

                    <p className="mt-4 text-xs text-text-muted">
                        No credit card required. Take 2 minutes to set up
                    </p>
                </div>
            </section>

            {/* How it works */}

            <section id="how-it-works" className="border-t border-border-subtle">
                <div className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            How it works
                        </h2>
                        <p className="mt-2 text-text-secondary">
                            Three steps from blank page to polished testimonial.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            {
                                step: "01",
                                icon: Link2,
                                title: "Share a link",
                                desc:"Generate a unique link with your own custom questions and send it to your client"
                            },
                            {
                                step: "02",
                                icon: MessageSquareText,
                                title: "Client answers",
                                desc:"No signiup needed. They answer a few simple questions in their own words, in under 2 minutes"
                            }, {
                                step: "03",
                                icon: Code2,
                                title: "AI polishes it",
                                desc:"Speakwell turns raw answers into a genuine-sounding testimonial ready to approve and embed"
                            }
                        ].map(({ step, icon: Icon, title, desc }) => (
                            <div
                                key={step}
                                className="rounded-lg border border-border bg-surface p-6"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs font-mono text-text-muted">
                                        {step}
                                    </span>
                                    <Icon className="h-5 w-5 text-text-secondary"/>
                                </div>
                                <h3 className="text-base font-medium">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live example */}

            <section className="border-t border-border-subtle">
                <div className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            From rough answers to this
                        </h2>

                        <p className="mt-2 text-text-secondary">
                            Here's what your embed widget looks like on a real site.
                        </p>
                    </div>

                    <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-6 shadow-md">
                        <div className="mb-3 flex items-center gap-1 text-info">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current"/>
                            ))}
                        </div>

                        <p className="text-sm leading-relaxed text-text-primary">
                            Honestly didn't expect the redesign to be done this fast. The new
                            checkout flow alone cut our cart abandonment by a noticeable amount within
                            the first week. Communication throught was clear and direct exactly what we needed.
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-sm font-medium">
                                P
                            </div>
                            <div>
                                <p className="text-sm font-medium">Shruti Sharma</p>
                                <p className="text-xs text-text-muted">Foundar, Loop Studio ✅ Verified via Speakwell</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Why it matters */}
            <section className="border-t border-border-subtle">
                <div className="mx-auto max-w-3xl px-6 py-20 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Testimonial never get written
                    </h2>
                    <p className="mt-4 leading-relaxed text-text-secondary">
                        You ask a happy client for a quote. They say "sure, I'll send
                        something." Then nothing happens not because they weren't satisfied,
                        but because staring at a blank box is hard. Speakwell removes that blank box entirely. A short,
                        guided form takes the place of an open-ended request, and AI does the writing - using their own words,
                        not generic praise.
                    </p>
                </div>
            </section>


            {/* CTA */}

            <section className="border-t border-border-subtle">
                <div className="mx-auto max-w-6xl px-6 py-20 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Ready to collect testimonials that sound real?
                    </h2>

                    <div className="mt-8">
                        {user ? (
                            <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 rounded-md bg-text-primary px-5 py-2.5 text-sm font-medium text-background transition hover:bg-accent-hover"
                        >Dashboard</Link>
                        ) : (
                                <Link
                            to="/register"
                            className="inline-flex items-center gap-2 rounded-md bg-text-primary px-5 py-2.5 text-sm font-medium text-background transition hover:bg-accent-hover"
                        >Get started for free</Link>
                        )}
                    </div>

                    <p className="mt-4 text-xs text-text-muted">
                        No creadit card. Takes 2 minutes
                    </p>
                </div>
            </section>

            {/* footer */}
            <footer className="border-t border-border-subtle">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-text-primary">
                            <Sparkles className="h-3.5 w-3.5 text-background"/>
                        </div>
                        <span className="text-sm font-medium">Speakwell</span>
                    </div>
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} Speakwell. All rights reserved
                    </p>
                </div>
            </footer>
        </div>
    )
};
