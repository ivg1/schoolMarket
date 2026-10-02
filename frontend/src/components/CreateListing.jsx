import { useEffect, useState } from "react";
import { Button, Checkbox, Label, TextInput, Textarea, Radio, FileInput, HelperText, Toast, ToastToggle, Spinner } from "flowbite-react";
import "./CreateListing.css";

import Server from "../serverComms/server";
import Auth from "../auth/auth";

export default function CreateListing({ open, onClose }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasInfo, setHasInfo] = useState(true);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(true);

    //todo: later make the form update through this, with onChange events
    const [newListing, setNewListing] = useState({
        type: "physical",
        title: "",
        price: "",
        negotiable: false,
        description: "",
        tags: "",
        includeEmail: true,
        includePhone: true,
        images: []
    });

    const [imageUploadingAllowed, setImageUploadingAllowed] = useState(true);

    //prevent background scrolling
    useEffect(() => {
        if (!open) return;

        const html = document.documentElement;
        html.style.overflow = "hidden";

        return () => {
            html.style.overflow = "scroll";
        };
    }, [open]);

    //confirm to discard listing
    useEffect(() => {
        if (!open) return;

        const handleBeforeUnload = (e) => {
            if (!hasInfo) return;
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [open, hasInfo]);

    //since this thing sometimes disappears (the creating thing), make sure to save it just in case
    useEffect(() => {
        if (newListing.title === "") return;
        localStorage.setItem("listingSave", JSON.stringify(newListing));
    }, [newListing]);
    
    //and also restore it
    useEffect(() => {
        const save = localStorage.getItem("listingSave");
        if (save) setNewListing(JSON.parse(save));

    }, [])

    if (!open) return null;

    const handleClose = () => {
        if (hasInfo && !window.confirm("Discard listing?")) return;
        localStorage.removeItem("listingSave");
        setNewListing({
            type: "physical",
            title: "",
            price: "",
            negotiable: false,
            description: "",
            tags: "",
            includeEmail: true,
            includePhone: true,
            images: []
        });
        setIsSubmitted(false);
        setError("");
        onClose();
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isSubmitted) return;
            setIsSubmitted(true);
            setError("");

            //const formData = new FormData(e.target);
            //const values = Object.fromEntries(formData.entries());
            //console.log(values);
            console.log(newListing);

            //general validation
            if (newListing.title === "") {
                setError("Title cannot be empty.");
                setShowError(true);
                setIsSubmitted(false);
                return;
            }
            if (newListing.title.length > 60) {
                setError("Title too long.");
                setShowError(true);
                setIsSubmitted(false);
                return;
            }

            if (newListing.price < 0) {
                setError("Price cannot be negative.");
                setShowError(true);
                setIsSubmitted(false);
                return;
            }
            if (newListing.price > 1000) {
                setError("Price is way too high.");
                setShowError(true);
                setIsSubmitted(false);
                return;
            }
            if (Math.round(newListing.price) !== Number(newListing.price)) {
                setError("Price has to be integer.");
                setShowError(true);
                setIsSubmitted(false);
                return;
            }

            if (newListing.description === "") {
                setError("Cannot have an empty description.");
                setShowError(true);
                setIsSubmitted(false);
                return;
            }
            if (newListing.description.length > 2000) {
                setError("Description too long.");
                setShowError(true);
                setIsSubmitted(false);
                return;
            }
            if (newListing.tags.length > 60) {
                setError("Tags too long.");
                setShowError(true);
                setIsSubmitted(false);
                return;
            }

            const goodTags = [...new Set(
                newListing.tags
                    .split(",")
                    .map(tag => tag.trim().toLowerCase())
                    .filter(tag => tag.length > 0)
                    .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1))
            )];

            //here i could just go through each image in a for loop and upload them one by one
            //but why not have parallel uploads so its faster. speeeeed
            let imageUrls = [];
            if (newListing.type === "physical") {
                //const images = formData.getAll("images").filter(
                //    image => image instanceof File && image.size > 0
                //);
                const images = newListing.images.filter(
                    image => image instanceof File && image.size > 0
                );
                console.log(images);

                //validate images
                const allowedTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp",
                    "image/heic",
                    "image/heif"
                ];

                if (images.length > 6) {
                    setError("Select less images. (Limit 6)");
                    setShowError(true);
                    setIsSubmitted(false);
                    return;
                }
                
                for (const image of images) {
                    console.log(image.type);
                    if (!allowedTypes.includes(image.type)) {
                        setError(`${image.name} is not a supported image type.`);
                        setShowError(true);
                        setIsSubmitted(false);
                        return;
                    }
                    if (image.size > 10 * 1024 * 1024) {
                        setError(`${image.name} exceeds 10MB.`);
                        setShowError(true);
                        setIsSubmitted(false);
                        return;
                    }
                }
                
                try {
                    const uploadPromises = images.map(image =>
                        Server.uploadImage(image)
                    );
        
                    const results = await Promise.all(uploadPromises);
                    imageUrls = results.map(result => result.image_url);
        
                    console.log(imageUrls);
                } catch (err) {
                    console.error(err);
                    setError(`Failed to upload one or more images: ${err}`);
                    setShowError(true);
                    setIsSubmitted(false);
                    return;
                }
            }
            
            try {

                const me = await Server.me();
                const username = me.username;
                const userData = await Server.users.getDataByUsername(username); //yes i dont leak anything other than email, phone and id here
                const sellerId = userData.id;
                const sellerEmail = newListing.includeEmail ? userData.email : null; //honestly idk how this might happen to set null but ok (update on 2/10/26: this does in fact set null now for some reason)
                const sellerPhone = newListing.includePhone ? userData.phone : null;

                const toSend = {
                    title: newListing.title,
                    description: newListing.description,
                    price: Number(newListing.price),
                    tags: goodTags,
                    images: imageUrls,
                    seller_id: sellerId,
                    seller_email: sellerEmail,
                    seller_phone: sellerPhone,
                    email_show: newListing.includeEmail && sellerEmail !== null,
                    phone_show: newListing.includePhone && sellerPhone !== null, //for now this will work, but later to add a feedback saying user doesnt have phone added
                    is_physical: (imageUploadingAllowed),
                    negotiable: newListing.negotiable
                };
                console.log(toSend);

                const response = await Server.listings.create(toSend);
                console.log("listing create response", response);

                setHasInfo(false);

                localStorage.removeItem("listingSave");
                setNewListing({
                    type: "physical",
                    title: "",
                    price: "",
                    negotiable: false,
                    description: "",
                    tags: "",
                    includeEmail: true,
                    includePhone: true,
                    images: []
                });

                onClose();
                setIsSubmitted(false);
                window.location.reload();
            } catch (err) {
                console.error("listing creation failed", err);
                setError(`Failed to create listing. ${err}`);
                setShowError(true);
                setIsSubmitted(false);
            }
        } catch (err) {
            console.error("Some error occured.", err);
            setError(`Some error occured. ${err}`);
            setShowError(true);
            setIsSubmitted(false);
        }
    };

    return (
        <div className="create-listing-overlay fixed inset-0 flex items-start justify-center overflow-hidden sm:items-center z-6000">
            <div className="create-listing-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="create-listing-panel relative z-1000 w-full max-w-200 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain sm:rounded-2xl bg-white p-6 shadow-2xl dark:bg-(--darkbg)">
                <Button
                    onClick={handleClose}
                    color="bglessOnlyText"
                    className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-(--darksurface-2) dark:hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </Button>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create listing</h2>
                <div className="pr-10 ">
                    <div className="flex flex-col">
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="form-item flex flex-col">
                                <h1 className="text-l mb-1">What type of listing is it?&nbsp;<span className="text-red-600">*</span></h1>
                                <div className="flex gap-2 m-1 justify-start items-center">
                                    <Radio color="red" id="physical" name="type" value="physical" defaultChecked 
                                        onChange={(e) => {
                                            setImageUploadingAllowed(e.target.value === "physical");
                                        }}
                                    />
                                    <Label htmlFor="physical">Physical item</Label>
                                </div>
                                <div className="flex gap-2 mx-1 justify-start items-center">
                                    <Radio color="red" id="service" name="type" value="service" 
                                        onChange={(e) => {
                                            setImageUploadingAllowed(e.target.value === "physical");
                                        }} 
                                    />
                                    <Label htmlFor="service">Service</Label>
                                </div>
                            </div>
                            <div className="form-item">
                                <div className="mb block">
								    <Label htmlFor="username">Title:&nbsp;<span className="text-red-600">*</span></Label>
							    </div>
							    <TextInput id="title" name="title" type="text" placeholder="Maths IGCSE Extended book" required shadow 
                                    value={newListing.title}
                                    onChange={(e) => {
                                        setNewListing({
                                            ...newListing,
                                            title: e.target.value
                                        })
                                    }}
                                    className={newListing.title.length > 60 ? "border-red-600 border-2 rounded-lg" : ""}
                                />
                                <div className="flex justify-end">
                                    <p className={newListing.title.length > 60 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>{newListing.title.length}/60</p>
                                </div>
                            </div>
                            <div className="form-item">
                                <div className="mb block">
								    <Label htmlFor="username">Price:&nbsp;<span className="text-red-600">*</span></Label>
							    </div>
							    <TextInput id="price" name="price" type="number" placeholder="10..?" min="0" step="1" required shadow 
                                    value={newListing.price}
                                    onChange={(e) => {
                                        setNewListing({
                                            ...newListing,
                                            price: Number(e.target.value)
                                        })
                                    }}
                                    className={newListing.price > 1000 ? "border-red-600 border-2 rounded-lg" : ""}
                                />
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-1 my-2">
                                        <Checkbox color="red" id="negotiable" name="negotiable" 
                                            checked={newListing.negotiable}
                                            onChange={(e) => {
                                                setNewListing({
                                                    ...newListing,
                                                    negotiable: e.target.checked
                                                });
                                            }}
                                        />
                                        <Label htmlFor="negotiable">Price negotiable</Label>
                                    </div>
                                    <p className={newListing.price > 1000 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>max. €1000</p>
                                </div>
                            </div>
                            <div className="form-item">
                                <div className="mb block">
								    <Label htmlFor="username">Description:&nbsp;<span className="text-red-600">*</span></Label>
							    </div>
							    <Textarea id="desc" name="desc" type="text" rows={4} placeholder="Used, in good condition..." required shadow 
                                    value={newListing.description}
                                    onChange={(e) => {
                                        setNewListing({
                                            ...newListing,
                                            description: e.target.value
                                        })
                                    }}
                                    className={newListing.description.length > 2000 ? "border-red-600 border-2 rounded-lg" : ""}
                                />
                                <div className="flex justify-between">
                                    <HelperText>Try to include things like, in case of a book, how used it is. Aim to write multiple lines.</HelperText>
                                    <p className={newListing.description.length > 2000 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>{newListing.description.length}/2000</p>
                                </div>
                            </div>
                            <div className="form-item">
                                <div className="mb block">
                                    <Label htmlFor="tags">Tags:</Label>
                                </div>
                                <TextInput id="tags" name="tags" placeholder="Book, Used, Maths, IGCSE, ..." shadow
                                    value={newListing.tags}
                                    onChange={(e) => {
                                        setNewListing({
                                            ...newListing,
                                            tags: e.target.value
                                        })
                                    }}
                                    className={newListing.tags.length > 60 ? "border-red-600 border-2 rounded-lg" : ""}
                                />
                                <div className="flex justify-between">
                                    <HelperText>Adding tags makes it easier to find your listing. Separate them by commas.</HelperText>
                                    <p className={newListing.tags.length > 60 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>{newListing.tags.length}/60</p>
                                </div>
                            </div>
                            <div className="form-item flex flex-col gap-1">
                                <div className="md block">
                                    <Label>Contact:</Label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Checkbox color="red" id="includePhone" name="includePhone"
                                        checked={newListing.includePhone}
                                        onChange={(e) => {
                                            setNewListing({
                                                ...newListing,
                                                includePhone: e.target.checked
                                            })
                                        }}
                                    />
                                    <Label htmlFor="include-phone">Display phone for contact</Label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Checkbox color="red" id="includeEmail" name="includeEmail" 
                                        checked={newListing.includeEmail}
                                        onChange={(e) => {
                                            setNewListing({
                                                ...newListing,
                                                includeEmail: e.target.checked
                                            })
                                        }}
                                    />
                                    <Label htmlFor="include-email">Display email for contact</Label>
                                </div>
                            </div>
                            {imageUploadingAllowed && (
                                <div className="form-item">
                                    {/* rlly got to change this up later to use https://picrd.com/docs ... nvm i set up hosting on my server */}
                                    <div id="images-upload">
                                        <Label htmlFor="images" className="mb block">Upload images</Label>
                                        <FileInput id="images" name="images" accept="image/png, image/jpg, image/jpeg, image/webp, image/heic, image/heif" multiple 
                                            onChange={(e) => {
                                                const images = Array.from(e.target.files || []);
                                                setNewListing({
                                                    ...newListing,
                                                    images: images
                                                })
                                            }}
                                        />
                                        <HelperText>Up to 6 images (max. 10MB each). Only images (incl. PNG, JPG, HEIC).</HelperText>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end mt-10 mr-2 mb-2">
                                <Button type="submit" color="red" disabled={isSubmitted}>{isSubmitted ? (<><Spinner color="failure" size="sm" className="me-3" light /> Uploading...</>) : "Create listing"}</Button>
                            </div>
                        </form>
                    </div>
                </div>
                {error && showError && (
                    <div className="min-w-screen fixed flex top-0 left-0 p-4">
                        <Toast>
                            {error}
                            <ToastToggle onDismiss={() => setShowError(false)} />
                        </Toast>
                    </div>
			    )}
            </div>
        </div>
    )
}

