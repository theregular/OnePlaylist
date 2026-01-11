import Link from "next/link";
import { AudioWaveform, ListMusic, Plug, User } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";

const navItems = [
    { label: "Playlists", href: "/playlists" },
    { label: "Crates", href: "/crates" },
    { label: "Imports", href: "/imports" },
    { label: "Signals", href: "/signals" },
];

const playlistStacks = [
    {
        title: "Warehouse 03",
        mood: "Raw house",
        updated: "synced 2h ago",
        services: ["Spotify", "SoundCloud"],
    },
    {
        title: "Sunrise Reset",
        mood: "Dub & ambient",
        updated: "synced 12m ago",
        services: ["Bandcamp", "Spotify"],
    },
];

const serviceBadges = [
    { label: "Spotify", accent: "bg-[#1DB954] text-black" },
    { label: "SoundCloud", accent: "bg-[#FF5500] text-white" },
    { label: "Bandcamp", accent: "bg-[#1DA0C3] text-white" },
];

export function Navbar() {
    return (
        <header className="w-full border-b-4 border-stone-950 bg-[#f7f3e8] text-stone-950 shadow-[8px_8px_0_#0f0f0f]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 lg:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                    <Link
                        href="/"
                        className="flex w-full shrink-0 items-center justify-between border-2 border-stone-950 bg-white px-4 py-3 uppercase tracking-[0.35em] shadow-[4px_4px_0_#0f0f0f] md:w-auto"
                    >
                        <div className="text-sm font-black leading-none">
                            <span className="block text-2xl leading-none">
                                onePlaylist
                            </span>
                            <span className="text-[0.55rem] tracking-[0.5em]">
                                multi-service crates
                            </span>
                        </div>
                        <AudioWaveform className="size-8" />
                    </Link>

                    <nav className="flex flex-1 flex-wrap items-center gap-2 border-2 border-dashed border-stone-900 px-3 py-2 text-sm font-semibold uppercase tracking-wide">
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                asChild
                                variant="ghost"
                                className="rounded-none border-2 border-transparent px-3 py-1 text-xs tracking-[0.25em] transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
                            >
                                <Link href={item.href}>{item.label}</Link>
                            </Button>
                        ))}
                    </nav>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-12 rounded-none border-2 border-stone-950 bg-white px-5 font-black uppercase tracking-[0.3em] shadow-[3px_3px_0_#0f0f0f]"
                        >
                            Launch Playlist
                        </Button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    className="flex h-12 w-12 items-center justify-center rounded-none border-2 border-stone-950 bg-black text-white shadow-[3px_3px_0_#0f0f0f]"
                                    variant="ghost"
                                >
                                    <User className="size-5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 border-2 border-stone-900 bg-[#fdfaf2] text-stone-950 shadow-[4px_4px_0_#0f0f0f]">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs uppercase">
                                        <span className="font-semibold tracking-[0.3em]">
                                            Profile
                                        </span>
                                        <span className="text-[0.65rem]">
                                            DJ INVISIBLE
                                        </span>
                                    </div>
                                    <p className="text-sm leading-tight text-stone-700">
                                        Connected services at a glance. Manage
                                        credentials and switch routing quickly.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {serviceBadges.map((service) => (
                                            <span
                                                key={service.label}
                                                className={`px-2 py-1 text-[0.65rem] font-semibold uppercase ${service.accent}`}
                                            >
                                                {service.label}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between border-t border-dashed border-stone-400 pt-3 text-[0.65rem] uppercase">
                                        <span>Account</span>
                                        <Button
                                            variant="ghost"
                                            className="h-8 rounded-none px-3 text-[0.65rem] tracking-[0.3em]"
                                        >
                                            Manage
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="grid gap-4 border-t-4 border-stone-950 pt-4 md:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs uppercase">
                            <div className="flex items-center gap-2 font-black tracking-[0.35em]">
                                <ListMusic className="size-4" />
                                Playlists in orbit
                            </div>
                            <Button
                                variant="ghost"
                                className="h-8 rounded-none px-3 text-[0.65rem] tracking-[0.3em]"
                            >
                                View all
                            </Button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            {playlistStacks.map((stack) => (
                                <div
                                    key={stack.title}
                                    className="flex flex-col gap-2 border-2 border-stone-950 bg-white px-4 py-3 shadow-[4px_4px_0_#0f0f0f]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-black uppercase tracking-[0.3em]">
                                            {stack.title}
                                        </span>
                                        <Plug className="size-4 text-stone-500" />
                                    </div>
                                    <p className="text-sm uppercase tracking-[0.25em] text-stone-500">
                                        {stack.mood}
                                    </p>
                                    <div className="flex flex-wrap gap-1 text-[0.65rem] font-semibold uppercase">
                                        {stack.services.map((service) => (
                                            <span
                                                key={service}
                                                className="border border-stone-900 px-2 py-0.5"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-[0.6rem] uppercase tracking-[0.4em] text-stone-500">
                                        {stack.updated}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 border-2 border-stone-950 bg-black p-4 text-white shadow-[6px_6px_0_#0f0f0f]">
                        <div className="flex items-center justify-between uppercase">
                            <span className="text-xs font-semibold tracking-[0.35em]">
                                Routing matrix
                            </span>
                            <AudioWaveform className="size-4" />
                        </div>
                        <p className="text-sm leading-tight text-white/80">
                            Pipe tracks from any connected service into one
                            playlist spine. Drag, drop, reorder, export.
                        </p>
                        <div className="grid gap-2 text-[0.65rem] uppercase">
                            <div className="flex items-center justify-between border-b border-white/20 pb-1">
                                <span>Spotify → Main crate</span>
                                <span className="font-black">Active</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/20 pb-1">
                                <span>SoundCloud → Drafts</span>
                                <span className="font-black text-lime-300">
                                    Live
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Bandcamp → Showcase</span>
                                <span className="font-black text-amber-200">
                                    Syncing
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            className="mt-2 h-11 rounded-none border-2 border-white bg-white text-black font-black uppercase tracking-[0.35em]"
                        >
                            Edit routes
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
