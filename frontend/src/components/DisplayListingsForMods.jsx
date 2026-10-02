import { Server } from "../serverComms/server.jsx";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";

function longAgo(listingTime) {
    const currentDate = new Date();
    const listingDate = new Date(listingTime);

    let differenceSeconds = Math.floor((currentDate - listingDate) / 1000);

    if (differenceSeconds < 60) {
        if (differenceSeconds == 1) return `1 second ago`;
        return `${differenceSeconds} seconds ago`;
    } else {
        let differenceMins = Math.floor((currentDate - listingDate) / (1000*60));
        if (differenceMins < 60) {
            if (differenceMins == 1) return `1 minute ago`;
            return `${differenceMins} minutes ago`;
        } else {
            let differenceHours = Math.floor((currentDate - listingDate) / (1000*60*60));
            if (differenceHours < 24) {
                if (differenceHours == 1) return `1 hour ago`;
                return `${differenceHours} hours ago`;
            } else {
                let differenceDays = Math.floor((currentDate - listingDate) / (1000*60*60*24));
                //if (differenceDays < 29) {
                //	if (differenceDays === 1) return "1 day ago";
                //	return `${differenceDays} days ago`;
                //}
                return `${differenceDays} days ago`;
                //later make better logic for handling months ago, years ago, etc...
            }
        }
    }
}

export default function DisplayListingsForMods({ onListingClick }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        Server.listings.mods.getAll()
            .then((data) => {
                if (!mounted) return;
                if (data.message === "unauthorised") {
                    setError("You are not authorised mate");
                    setLoading(false);
                    mounted = false;
                    return;
                }
                setListings(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err);
                setLoading(false);
            });
        return () => { mounted = false };
    }, []);

    const handleReject = async (id) => {
        try {
            const toSend = {
                id: id
            }
            const response = await Server.listings.mods.reject(toSend);
            console.log(response);
        } catch (err) {
            console.error("failed rejecting listing");
        }
    }

    const handleAccept = async (id) => {
        try {
            const toSend = {
                id: id
            }
            const response = await Server.listings.mods.accept(toSend);
            console.log(response);
        } catch (err) {
            console.error("failed accepting listing");
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Confirm deleting listing?")) return;
        try {
            const toSend = {
                id: id
            }
            const response = await Server.listings.delete(toSend);
            console.log(response);
        } catch (err) {
            console.error("failed deleting listing");
        }
    }

    
    if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    
    //dark:hover:bg-[#320505]
    return (
        <div className="listing-list min-w-full max-w-full p-2 justify-items-center">
            {listings.length > 0 ? (
                listings.map((listing) => (
                    <div key={listing.id}>
                        {listing.is_physical ? (
                            <div className="listing-card min-h-fit hover:cursor-pointer hover:bg-white dark:hover:bg-[#151515]" key={listing.id} listingid={listing.id}>
                                <div className="listing-card-image-container relative">
                                    <a href={`/listings/${listing.id}`} className="no-underline m-0 p-0 w-full h-full absolute top-0 left-0 z-2"></a>
                                    {
                                        (() => {
                                            const images = listing.images;
                                            let src = "/placeholderListing.png";
                                            if (Array.isArray(images) && images.length > 0) {
                                                src = images[0];
                                            } else if (typeof images === "string" && images.length > 0) {
                                                const maybe = images.replace(/^\{|\}$/g, "").split(',')[0];
                                                src = maybe;
                                            } else {
                                                return <div className="flex justify-center items-center w-full h-full">NO IMAGE</div>
                                            }
                                            return <img src={src} alt={listing.title} className="listing-card-image" />;
                                        })()
                                    }
                                </div>
                                <div className="px-4 py-0 m-0 flex flex-col items-start">
                                    <h1 className="listing-card-price text-2xl font-bold text-left">${listing.price}</h1>
                                    <h1 className="listing-card-title text-l font-bold text-left">{listing.title}</h1>
                                    <p className="listing-card-date text-sm text-gray-500">{longAgo(listing.created_at)}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button color="red" className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                        onClick={() => { handleAccept(listing.id) }}
                                    >
                                        Accept
                                    </Button>
                                    <Button color="red"
                                        onClick={() => { handleReject(listing.id) }}
                                    >
                                        Reject
                                    </Button>
                                    <Button color="red"
                                        onClick={() => { handleDelete(listing.id) }}
                                    >
                                        Delete
                                    </Button>
                                    <Button color="bgless" onClick={() => onListingClick?.(listing)}>View listing</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="listing-card min-h-fit hover:cursor-pointer hover:bg-white dark:hover:bg-[#151515]" key={listing.id} listingid={listing.id}>
                                <div className="listing-service-desc-container p-2 relative">
                                    <a href={`/listings/${listing.id}`} className="no-underline m-0 p-0 w-full h-full absolute top-0 left-0 z-2"></a>
                                    <h1 className="text-md font-bold mb-0">Service</h1>
                                    <div className="mb-2">
                                        <h1 className="listing-card-title text-3xl font-bold text-left min-h-fit">{listing.title}</h1>
                                    </div>
                                    <div className="listing-service-desc">
                                        {listing.description ? (
                                            <p className="whitespace-pre-wrap text-sm">{listing.description}</p>
                                        ) : (
                                            <p className="whitespace-pre-wrap">no description provided</p>
                                        )}
                                    </div>
                                </div>
                                <div className="px-4 py-0 m-0 flex flex-col items-start min-h-20">
                                    {listing.price === 0 ? (
                                        <h1 className="listing-card-price text-2xl font-bold text-left">Free</h1>
                                    ) : (
                                        <h1 className="listing-card-price text-2xl font-bold text-left">€{listing.price}</h1>
                                    )}
                                    <p className="listing-card-date text-sm text-gray-500">{longAgo(listing.created_at)}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button color="red" className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                        onClick={() => { handleAccept(listing.id) }}
                                    >
                                        Accept
                                    </Button>
                                    <Button color="red"
                                        onClick={() => { handleReject(listing.id) }}
                                    >
                                        Reject
                                    </Button>
                                    <Button color="red"
                                        onClick={() => { handleDelete(listing.id) }}
                                    >
                                        Delete
                                    </Button>
                                    <Button color="bgless" onClick={() => onListingClick?.(listing)}>View listing</Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center">No listings waiting to be moderated.</p>
            )}
        </div>
    )
}