"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { api } from "~/trpc/react";
import { TrackCard } from "./TrackCard";

export function TrackSearch() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const trackSearch = api.soundcloud.search.useQuery({
        query: search,
    }, {
        enabled: !!search,
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverAnchor>
                <Input
                    className="w-200"
                    placeholder="Type to search..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => search && setOpen(true)}
                />
            </PopoverAnchor>
            <PopoverContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="max-h-200 overflow-auto w-200"
                align="start"
            >
                {trackSearch.data?.collection &&
                        trackSearch.data?.collection.length > 0
                    ? trackSearch.data.collection.map((track) => (
                        <TrackCard
                            key={track.id}
                            artworkUrl={track.artwork_url}
                            title={track.title}
                            artist={track.user.username}
                            duration={track.duration}
                            id={track.id}
                        />
                    ))
                    : trackSearch.isLoading
                    ? <div>Loading...</div>
                    : <div>NO RESULTS</div>}
            </PopoverContent>
        </Popover>
    );
}
