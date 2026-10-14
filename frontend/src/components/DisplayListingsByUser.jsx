import Server from "../serverComms/server.jsx";
import { useEffect, useState } from "react";
import Auth from "../auth/auth.jsx";

//the styles from Listings.css work here, dont touch them.
//if it works it works.

function longAgo(listingTime) {
    const currentDate = new Date();
    const listingDate = new Date(listingTime);

    let differenceSeconds = Math.floor((currentDate - listingDate) / 1000);

    if (differenceSeconds < 60) {
        if (differenceSeconds == 1) return `1 second ago`;
        return `${differenceSeconds} seconds ago`;
    } else {
        let differenceMins = Math.floor((currentDate - listingDate) / (1000 * 60));
        if (differenceMins < 60) {
            if (differenceMins == 1) return `1 minute ago`;
            return `${differenceMins} minutes ago`;
        } else {
            let differenceHours = Math.floor((currentDate - listingDate) / (1000 * 60 * 60));
            if (differenceHours < 24) {
                if (differenceHours == 1) return `1 hour ago`;
                return `${differenceHours} hours ago`;
            } else {
                let differenceDays = Math.floor((currentDate - listingDate) / (1000 * 60 * 60 * 24));
                return `${differenceDays} days ago`;
            }
        }
    }
}

export default function DisplayListings({ onListingClick, profileId }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [me, setMe] = useState(null);
    const [mod, setMod] = useState(false);

    const [yourId, setYourId] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [profileId]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);
        console.log(profileId);

        Server.listings.getAllByUser({ id: profileId, page: currentPage })
            .then(async (data) => {
                if (!mounted) return;

                const pageListings = Array.isArray(data?.listings) ? data.listings : [];
                const pages = Math.max(1, Number(data?.pagination?.totalPages) || 1);

                setListings(pageListings);
                setTotalPages(pages);
                setLoading(false);

                if (await Auth.loginState()) return Server.me();
            })
            .then(async (me) => {
                if (!mounted) return;
                if (!me) return;

                setMe(me);
                setYourId(me.id);
                console.log(me.id);

                if (me.is_mod) setMod(true);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err);
                setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [profileId, currentPage]);

    // moderator stuff
    const handleReject = async (id) => {
        if (!mod) return console.log("you aint mod buddy");
        if (!window.confirm("Confirm reject listing?")) return;
        try {
            const toSend = {
                id: id
            };
            const response = await Server.listings.mods.reject(toSend);
            console.log(response);
        } catch (err) {
            console.error("failed rejecting listing");
        }
    };

    const handleAccept = async (id) => {
        if (!mod) return console.log("you aint mod buddy");
        if (!window.confirm("Confirm accept listing?")) return;
        try {
            const toSend = {
                id: id
            };
            const response = await Server.listings.mods.accept(toSend);
            console.log(response);
        } catch (err) {
            console.error("failed accepting listing");
        }
    };

    if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">Error loading listings</p>;

    return (
        <>
        <div className="listing-list p-2 justify-items-center">
            {listings.length > 0 ? (
                <>
                    {listings.map((listing) => (
                        <div key={listing.id}>
                            <div className="listing-card relative min-h-fit hover:bg-white hover:cursor-pointer dark:hover:bg-[#151515] overflow-hidden" key={listing.id} listingid={listing.id}>
                                <div className="flex flex-col gap-2" onClick={() => { onListingClick?.(listing); }}>
                                    {!listing.awaiting_moderation && (
                                        <a href={`/listings/${listing.id}`} className="no-underline m-0 p-0 w-full h-full absolute top-0 left-0 z-2"></a>
                                    )}
                                    <div className="listing-card-image-container">
                                        {listing.awaiting_moderation ? (
                                            <div className="m-2">
                                                <div className="mb-2">
                                                    <h1 className="listing-card-title text-3xl font-bold text-left min-h-fit">{listing.title}</h1>
                                                </div>
                                            </div>
                                        ) : (
                                            (() => {
                                                const images = listing.images;
                                                let src = "/placeholderListing.png";
                                                if (Array.isArray(images) && images.length > 0) {
                                                    src = images[0];
                                                } else if (typeof images === "string" && images.length > 0) {
                                                    const maybe = images.replace(/^\{|\}$/g, "").split(",")[0];
                                                    src = maybe;
                                                } else {
                                                    return <div className="flex justify-center items-center w-full h-full">NO IMAGE</div>;
                                                }
                                                return <img src={src} alt={listing.title} className="listing-card-image" />;
                                            })()
                                        )}
                                    </div>
                                    <div className="px-4 py-0 m-0 flex flex-col items-start min-h-20">
                                        {listing.price === 0 ? (
                                            <h1 className="listing-card-price text-2xl font-bold text-left">Free</h1>
                                        ) : (
                                            <h1 className="listing-card-price text-2xl font-bold text-left">€{listing.price}</h1>
                                        )}
                                        <h1 className="listing-card-title font-bold text-left">{listing.title}</h1>
                                        <p className="listing-card-date text-sm text-gray-500">{longAgo(listing.created_at)}</p>
                                    </div>
                                </div>

                                {listing.awaiting_moderation && (
                                    <>
                                        {yourId === Number(listing.seller_id) || mod ? (
                                            <a href={`/listings/${listing.id}`} className="no-underline m-0 p-0 w-full h-full absolute top-0 left-0 z-2"></a>
                                        ) : null}
                                        <div className="absolute top-0 left-0 w-full h-full dark:bg-black/80 bg-black/20 overflow-hidden">
                                            <div className="absolute top-[45%] left-[-30%] w-[160%] -rotate-40 bg-red-800 py-2 text-center tracking-widest">
                                                <span className="font-bold text-white">
                                                    AWAITING MODERATION
                                                </span>
                                            </div>
                                        </div>
                                        {yourId === Number(listing.seller_id) && (
                                            <div className="absolute top-[60%] left-[-25%] w-[160%] -rotate-40 text-center">
                                                <span className="text-md rounded-2xl bg-white p-2 dark:bg-transparent">
                                                    (your listing)
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <p className="text-gray-500 text-center">No listings found</p>
            )}
        </div>
        <div className="mt-16 mb-4 flex justify-center items-center gap-2">
            <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage <= 1 || loading}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
            >
                Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
                Page {currentPage} of {totalPages}
            </span>
            <button
                type="button"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= totalPages || loading}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
            >
                Next
            </button>
        </div>
        </>
    );
}
