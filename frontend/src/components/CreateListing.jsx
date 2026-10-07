import { useEffect, useState } from "react";
import { Button, Checkbox, Label, TextInput, Textarea, Radio, FileInput, HelperText, Toast, ToastToggle, Spinner, Select } from "flowbite-react";
import "./CreateListing.css";

import Server from "../serverComms/server";
import Auth from "../auth/auth";

export default function CreateListing({ open, onClose }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasInfo, setHasInfo] = useState(true);

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(true);

    const initialListing = {
        type: "physical",

        title: "",
        price: "",
        negotiable: false,
        description: "",
        tags: "",

        includeEmail: true,
        includePhone: true,

        schoolSystem: "",
        school: "",
        otherSchool: "",
        schoolClass: "",

        // physical only
        condition: "",
        images: [],

        // service only
        // nothing yet
    };

    const [newListing, setNewListing] = useState(initialListing);

    const [step, setStep] = useState(1);
    const totalSteps = newListing.type === "physical" ? 6 : 5;

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
        if (newListing.title === "" && newListing.description === "" && newListing.price === "") return;
        const listingToSave = {
            ...newListing,
            images: []
        };

        localStorage.setItem("listingSave", JSON.stringify(listingToSave));
    }, [newListing]);
    
    //and also restore it
    useEffect(() => {
        const save = localStorage.getItem("listingSave");
        
        if (!save) return;

        try {
            const savedListing = JSON.parse(save);

            setNewListing({
                ...initialListing,
                ...savedListing,
                images: [] //dont save images
            });

            setHasInfo(true);
        } catch (err) {
            console.error("Failed to parse saved listing:", err);
            localStorage.removeItem("listingSave");
        }
    }, [])

    if (!open) return null;

    //steps
    const stepNames = 
        newListing.type === "physical"
            ? [
                "Type",
                "Basic info",
                "School info",
                "Tags & Contact",
                "Images",
                "Review & submit"
            ]
            : [
                "Type",
                "Basic info",
                "School info",
                "Tags & Contact",
                "Review & submit"
            ]

    //updating listing logic
    const updateListing = (field, value) => {
        setNewListing(prevListing => ({
            ...prevListing,
            [field]: value
        }));

        setHasInfo(true);
    }

    const changeListingType = (type) => {
        setNewListing((prev) => ({
            ...prev,
            type
        }));

        setHasInfo(true);
        setError("");

        //if user switches while having step more than 4
        if (
            type === "service" &&
            step > 4
        ) {
            setStep(4);
        }
    };

    const checkStep = (checkingStep = step) => {
        setError("");
        setShowError(false);

        if (checkingStep === 1) {
            if (newListing.type !== "physical" && newListing.type !== "service") {
                showErrorMsg("Please Select a listing type.");
                return false;
            }
        }

        if (checkingStep === 2) {
            const title = newListing.title.trim();
            const description = newListing.description.trim();
            const price = newListing.price;

            if (title === "") {
                showErrorMsg("Title cannot be empty.");
                return false;
            }
            if (title.length > 60) {
                showErrorMsg("Title too long.");
                return false;
            }

            if (price === "" || price === null || price === undefined) {
                showErrorMsg("Price cannot be empty.");
                return false;
            }
            const priceNum = Number(price);
            if (Number.isNaN(priceNum)) {
                showErrorMsg("Price must be a number.");
                return false;
            }
            if (priceNum < 0) {
                showErrorMsg("Price cannot be negative.");
                return false;
            }
            if (priceNum > 1000) {
                showErrorMsg("Price is way too high.");
                return false;
            }
            if (Math.round(priceNum) !== priceNum) {
                showErrorMsg("Price has to be integer.");
                return false;
            }

            if (description === "") {
                showErrorMsg("Description cannot be empty.");
                return false;
            }
            if (description.length > 2000) {
                showErrorMsg("Description too long.");
                return false;
            }

            if (newListing.type === "physical" && newListing.condition === "") {
                showErrorMsg("Please Select the item's condition.");
                return false;
            }
        }

        if (checkingStep === 3) {
            //make logic for setting school, type of school, etc.
            if (newListing.schoolSystem.trim() === "") {
                showErrorMsg("Select a school system.");
                return false;
            }
            if (newListing.school.trim() === "") {
                showErrorMsg("Please Select a school.");
                return false;
            }
            if (newListing.school === "Other" && newListing.otherSchool.trim() === "") {
                showErrorMsg("Please enter the other school name.");
                return false;
            }
            if (newListing.schoolClass === "") {
                showErrorMsg("Please Select a class.");
                return false;
            }
        }

        if (checkingStep === 4) {
            if (newListing.tags.length > 60) {
                showErrorMsg("Tags too long.");
                return false;
            }
        }

        if (checkingStep === 5 && newListing.type === "physical") {
            const images = newListing.images.filter(
                (image) =>
                    image instanceof File &&
                    image.size > 0
            );

            if (images.length > 6) {
                showErrorMsg(
                    "Select less images. (Limit 6)"
                );
                return false;
            }

            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
                "image/heic",
                "image/heif"
            ];

            for (const image of images) {
                if (!allowedTypes.includes(image.type)) {
                    showErrorMsg(
                        `${image.name} is not a supported image type.`
                    );
                    return false;
                }

                if (image.size > 10 * 1024 * 1024) {
                    showErrorMsg(
                        `${image.name} exceeds 10MB.`
                    );
                    return false;
                }
            }
        }

        return true;
    }

    const nextStep = () => {
        if (!checkStep()) return;
        setError("");

        if (step < totalSteps) {
            setStep((prev) => prev + 1);
        }
    }

    const previousStep = () => {
        setError("");
        setShowError(false);

        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    }


    const showErrorMsg = (message) => {
        setError(message);
        setShowError(true);
    }

    const handleClose = () => {
        if (hasInfo && !window.confirm("Discard listing?")) return;

        localStorage.removeItem("listingSave");

        setNewListing({
            ...initialListing
        });

        setStep(1);
        setIsSubmitted(false);
        setError("");
        onClose();
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitted) return;

        //in case something SOMEHOW slips through
        for (let currentStep = 1; currentStep <= totalSteps; currentStep++) {
            if (!checkStep(currentStep)) {
                setStep(currentStep);
                return;
            }
        }

        try {
            setIsSubmitted(true);
            setError("");

            //const formData = new FormData(e.target);
            //const values = Object.fromEntries(formData.entries());
            //console.log(values);
            console.log(newListing);

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
                const images = newListing.images.filter(
                    image => image instanceof File && image.size > 0
                );

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
                const sellerEmail = newListing.includeEmail ? userData.email : null; //honestly idk how this might happen to set null but ok (update on 2/10/26: this did happen.. umm)
                const sellerPhone = newListing.includePhone ? userData.phone : null;

                const toSend = {
                    is_physical: newListing.type === "physical",

                    title: newListing.title.trim(),
                    description: newListing.description.trim(),
                    price: Number(newListing.price),
                    negotiable: newListing.negotiable,

                    tags: goodTags,
                    images: imageUrls,

                    seller_id: sellerId,
                    seller_email: sellerEmail,
                    seller_phone: sellerPhone,
                    email_show: newListing.includeEmail && sellerEmail !== null,
                    phone_show: newListing.includePhone && sellerPhone !== null,

                    school_system: newListing.schoolSystem || null,
                    school: newListing.school || null,
                    other_school: newListing.school === "Other"
                        ? (newListing.otherSchool?.trim() || null)
                        : null,
                    school_class: newListing.schoolClass || null,

                    condition: newListing.type === "physical"
                        ? (newListing.condition || null)
                        : null
                };

                console.log("creating lising: ", toSend);

                const response = await Server.listings.create(toSend);
                console.log("listing create response", response);

                setHasInfo(false);

                localStorage.removeItem("listingSave");
                setNewListing({
                    ...initialListing
                });

                setStep(1);

                onClose();
                setIsSubmitted(false);

                window.location.reload();
            } catch (err) {
                console.error("listing creation failed", err);
                setError(`Failed to create listing. ${err}. Please try again.`);
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
        <div className="create-listing-panel relative z-1000 w-full max-w-200 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain sm:rounded-2xl bg-white p-6 shadow-2xl dark:bg-(--darkbg) min-h-full sm:min-h-0">
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
            <div className="">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Step {step} of {totalSteps}
                        </p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {stepNames[step - 1]}
                        </p>
                    </div>

                    <div className="flex gap-1">
                        {stepNames.map((smthn, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${i + 1 <= step ? "bg-red-600" : "bg-gray-200 dark:bg-black"}`}
                            />
                        ))}
                    </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="form-item flex flex-col">
                            <h1 className="text-xl mb-4">What type of listing is it?&nbsp;<span className="text-red-600">*</span></h1>

                            <label
                                htmlFor="physical"
                                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 mb-3 transition ${
                                    newListing.type === "physical"
                                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                        : "border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <Radio
                                    color="red"
                                    id="physical"
                                    className=""
                                    name="type"
                                    value="physical"
                                    checked={newListing.type === "physical"}
                                    onChange={() => changeListingType("physical")}
                                />
                                <div>
                                    <Label htmlFor="physical" className="cursor-pointer font-semibold">
                                        Physical item
                                    </Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Sell physical items such as books and other school materials.
                                    </p>
                                </div>
                            </label>

                            <label
                                htmlFor="service"
                                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                                    newListing.type === "service"
                                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                        : "border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <Radio
                                    color="red"
                                    id="service"
                                    name="type"
                                    value="service"
                                    checked={newListing.type === "service"}
                                    onChange={() => changeListingType("service")}
                                />
                                <div>
                                    <Label htmlFor="service" className="cursor-pointer font-semibold">
                                        Service
                                    </Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Offer a service such as tutoring, homework help, etc.
                                    </p>
                                </div>
                            </label>
                        </div>
                    )}

                    {step === 2 && (
                        <>
                            <div className="form-item">
                                <div className="mb block">
                                    <Label htmlFor="title">Title:&nbsp;<span className="text-red-600">*</span></Label>
                                </div>
                                <TextInput
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder={newListing.type === "physical" ? "Maths IGCSE book" : "Tutoring"}
                                    required
                                    shadow
                                    value={newListing.title}
                                    onChange={(e) => updateListing("title", e.target.value)}
                                    className={newListing.title.length > 60 ? "border-red-600 border-2 rounded-lg" : ""}
                                />
                                <div className="flex justify-end">
                                    <p className={newListing.title.length > 60 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>{newListing.title.length}/60</p>
                                </div>
                            </div>

                            <div className="form-item">
                                <div className="mb block">
                                    <Label htmlFor="price">Price:&nbsp;<span className="text-red-600">*</span></Label>
                                </div>
                                <TextInput
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="10..?"
                                    min="0"
                                    step="1"
                                    required
                                    shadow
                                    value={newListing.price}
                                    onChange={(e) => updateListing("price", e.target.value)}
                                    className={Number(newListing.price) > 1000 ? "border-red-600 border-2 rounded-lg" : ""}
                                />
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-1 my-2">
                                        <Checkbox
                                            color="red"
                                            id="negotiable"
                                            name="negotiable"
                                            checked={newListing.negotiable}
                                            onChange={(e) => updateListing("negotiable", e.target.checked)}
                                        />
                                        <Label htmlFor="negotiable">Price negotiable</Label>
                                    </div>
                                    <p className={Number(newListing.price) > 1000 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>max. €1000</p>
                                </div>
                            </div>

                            <div className="form-item">
                                <div className="mb block">
                                    <Label htmlFor="description">Description:&nbsp;<span className="text-red-600">*</span></Label>
                                </div>
                                <Textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    placeholder={newListing.type === "physical" ? "Used, in good condition..." : "Describe the service you offer..."}
                                    required
                                    shadow
                                    value={newListing.description}
                                    onChange={(e) => updateListing("description", e.target.value)}
                                    className={newListing.description.length > 2000 ? "border-red-600 border-2 rounded-lg" : ""}
                                />
                                <div className="flex justify-between">
                                    <HelperText>
                                        {newListing.type === "physical"
                                            ? "Try to include things like, in case of a book, how used it is. Aim to write multiple lines."
                                            : "Describe, if applicable, the duration, location and any other details of service."}
                                    </HelperText>
                                    <p className={newListing.description.length > 2000 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>{newListing.description.length}/2000</p>
                                </div>
                            </div>

                            {newListing.type === "physical" && (
                                <div>
                                    <div className="mb block">
                                        <Label htmlFor="condition">Condition:&nbsp;<span className="text-red-600">*</span></Label>
                                    </div>
                                    <Select
                                        id="condition"
                                        name="condition"
                                        value={newListing.condition}
                                        onChange={(e) => updateListing("condition", e.target.value)}
                                        className=""
                                    >
                                        <option value="">-- Select condition --</option>
                                        <option value="New">New</option>
                                        <option value="Like new">Like new</option>
                                        <option value="Good">Good</option>
                                        <option value="Used">Used</option>
                                        <option value="Poor">Bad</option>
                                    </Select>
                                </div>
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <div className="form-item flex flex-col gap-4">
                            <div>
                                <div className="mb block">
                                    <Label htmlFor="schoolSystem">School system:&nbsp;<span className="text-red-600">*</span></Label>
                                </div>
                                <Select
                                    id="schoolSystem"
                                    name="schoolSystem"
                                    value={newListing.schoolSystem}
                                    onChange={(e) => updateListing("schoolSystem", e.target.value)}
                                    className=""
                                >
                                    <option value="">-- Select school system --</option>
                                    <option value="Greek">Greek</option>
                                    <option value="English">English</option>
                                    <option value="Russian">Russian</option>
                                </Select>
                            </div>

                            <div>
                                <div className="mb block">
                                    <Label htmlFor="school">School:&nbsp;<span className="text-red-600">*</span></Label>
                                </div>
                                <Select
                                    id="school"
                                    name="school"
                                    value={newListing.school}
                                    onChange={(e) => updateListing("school", e.target.value)}
                                    className=""
                                >
                                    <option value="">-- Select school --</option>

                                    {newListing.schoolSystem === "Greek" && (
                                        <>
                                            <option value="Agiou Nikolaou Lyceum">Agiou Nikolaou Lyceum</option>
                                            <option value="Linopetra Lyceum">Linopetra Lyceum</option>
                                        </>
                                    )}
                                    {newListing.schoolSystem === "English" && (
                                        <>
                                            <option value="The Heritage Private School">The Heritage Private School</option>
                                            <option value="The Island Private School">The Island Private School</option>
                                            <option value="The Grammar School">The Grammar School</option>
                                            <option value="American Academy">American Academy</option>
                                            <option value="Foley's Private School">Foley's Private School</option>
                                            <option value="Pascal">Pascal Private School</option>
                                        </>
                                    )}
                                    {newListing.schoolSystem === "Russian" && (
                                        <>
                                            <option value="Trinity">Trinity</option>
                                        </>
                                    )}
                                    
                                    <option value="Other">Other</option>
                                </Select>
                                {newListing.school === "Other" && (
                                    <div className="mt-2">
                                        <TextInput
                                            id="otherSchool"
                                            name="otherSchool"
                                            placeholder="Enter other school"
                                            value={newListing.otherSchool}
                                            onChange={(e) => updateListing("otherSchool", e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="mb block">
                                    <Label htmlFor="schoolClass">School class:&nbsp;<span className="text-red-600">*</span></Label>
                                </div>
                                <Select
                                    id="schoolClass"
                                    name="schoolClass"
                                    value={newListing.schoolClass}
                                    onChange={(e) => updateListing("schoolClass", e.target.value)}
                                    className=""
                                >
                                        <option value="">-- Select school class --</option>
                                        <option value="Year 1 / Α' Δημοτικού">Year 1 / Α' Δημοτικού</option>
                                        <option value="Year 2 / Β' Δημοτικού">Year 2 / Β' Δημοτικού</option>
                                        <option value="Year 3 / Γ' Δημοτικού">Year 3 / Γ' Δημοτικού</option>
                                        <option value="Year 4 / Δ' Δημοτικού">Year 4 / Δ' Δημοτικού</option>
                                        <option value="Year 5 / Ε' Δημοτικού">Year 5 / Ε' Δημοτικού</option>
                                        <option value="Year 6 / ΣΤ' Δημοτικού">Year 6 / ΣΤ' Δημοτικού</option>
                                        <option value="Year 7 / Α' Γυμνασίου">Year 7 / Α' Γυμνασίου</option>
                                        <option value="Year 8 / Β' Γυμνασίου">Year 8 / Β' Γυμνασίου</option>
                                        <option value="Year 9 / Γ' Γυμνασίου">Year 9 / Γ' Γυμνασίου</option>
                                        <option value="Year 10 / Α' Λυκείου">Year 10 / Α' Λυκείου</option>
                                        <option value="Year 11 / Β' Λυκείου">Year 11 / Β' Λυκείου</option>
                                        <option value="Year 12 / Γ' Λυκείου">Year 12 / Γ' Λυκείου</option>
                                        <option value="Year 13">Year 13</option>
                                </Select>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <>
                            <div className="form-item">
                                <div className="mb block">
                                    <Label htmlFor="tags">Tags:</Label>
                                </div>
                                <TextInput
                                    id="tags"
                                    name="tags"
                                    placeholder="Book, Used, Maths, IGCSE, ..."
                                    shadow
                                    value={newListing.tags}
                                    onChange={(e) => updateListing("tags", e.target.value)}
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
                                    <Checkbox
                                        color="red"
                                        id="includePhone"
                                        name="includePhone"
                                        checked={newListing.includePhone}
                                        onChange={(e) => updateListing("includePhone", e.target.checked)}
                                    />
                                    <Label htmlFor="includePhone">Display phone for contact</Label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Checkbox
                                        color="red"
                                        id="includeEmail"
                                        name="includeEmail"
                                        checked={newListing.includeEmail}
                                        onChange={(e) => updateListing("includeEmail", e.target.checked)}
                                    />
                                    <Label htmlFor="includeEmail">Display email for contact</Label>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 5 && newListing.type === "physical" && (
                        <div className="form-item">
                            <div id="images-upload">
                                <Label htmlFor="images" className="mb block">Upload images</Label>
                                <FileInput
                                    id="images"
                                    name="images"
                                    accept="image/png, image/jpg, image/jpeg, image/webp, image/heic, image/heif"
                                    multiple
                                    onChange={(e) => {
                                        const images = Array.from(e.target.files || []);
                                        updateListing("images", images);
                                    }}
                                />
                                <HelperText>Up to 6 images (max. 10MB each). Only images (incl. PNG, JPG, HEIC).</HelperText>
                            </div>
                        </div>
                    )}

                    {step === totalSteps && (
                        <div className="form-item flex flex-col gap-4">
                            <h1 className="text-xl mb-1">Review & submit</h1>

                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                <p className="text-sm text-gray-500">Type</p>
                                <p className="font-medium mb-4">
                                    {newListing.type === "physical" ? "Physical item" : "Service"}
                                </p>

                                <p className="text-sm text-gray-500">Title</p>
                                <p className="font-medium mb-4 break-words">{newListing.title}</p>

                                <p className="text-sm text-gray-500">Price</p>
                                <p className="font-medium mb-4">
                                    €{newListing.price} {newListing.negotiable && "(Negotiable)"}
                                </p>

                                <p className="text-sm text-gray-500">Description</p>
                                <p className="whitespace-pre-wrap mb-4 break-words">{newListing.description}</p>

                                {newListing.type === "physical" && (
                                    <>
                                        <p className="text-sm text-gray-500">Condition</p>
                                        <p className="font-medium mb-4">{newListing.condition}</p>

                                        <p className="text-sm text-gray-500">Images</p>
                                        <p className="font-medium mb-4">{newListing.images.length} given</p>
                                    </>
                                )}

                                <p className="text-sm text-gray-500">School system</p>
                                <p className="font-medium mb-4">{newListing.schoolSystem}</p>

                                <p className="text-sm text-gray-500">School</p>
                                <p className="font-medium mb-4 break-words">{newListing.school !== "Other" ? newListing.school : newListing.otherSchool}</p>

                                <p className="text-sm text-gray-500">School class</p>
                                <p className="font-medium mb-4">{newListing.schoolClass}</p>


                                <p className="text-sm text-gray-500">Tags</p>
                                <p className="font-medium mb-4 break-words">{
                                    [...new Set(
                                        newListing.tags
                                            .split(",")
                                            .map(tag => tag.trim().toLowerCase())
                                            .filter(tag => tag.length > 0)
                                            .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1))
                                    )].join(", ") || "None"}
                                </p>

                                <p className="text-sm text-gray-500">Contacts given</p>
                                <p className="font-medium">
                                    {newListing.includeEmail && "Email"}
                                    {newListing.includeEmail && newListing.includePhone && " & "}
                                    {newListing.includePhone && "Phone"}
                                    {!newListing.includeEmail && !newListing.includePhone && "None"}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-10 mr-2 mb-2">
                        {step > 1 ? (
                            <Button
                                type="button"
                                color=""
                                onClick={previousStep}
                                disabled={isSubmitted}
                            >
                                Previous
                            </Button>
                        ) : (
                            <div />
                        )}

                        {step < totalSteps ? (
                            <Button
                                type="button"
                                color="red"
                                onClick={nextStep}
                                disabled={isSubmitted}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                color="red"
                                disabled={isSubmitted}
                                onClick={handleSubmit}
                            >
                                {isSubmitted ? (
                                    <>
                                        <Spinner color="failure" size="sm" className="me-3" light />
                                        Uploading...
                                    </>
                                ) : (
                                    "Create listing"
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            {error && showError && (
                <div className="w-full max-w-screen fixed flex top-0 left-0 p-4">
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

