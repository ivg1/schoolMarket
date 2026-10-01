import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Checkbox, Label, Radio, Textarea, TextInput, HR, Toast, ToastToggle } from "flowbite-react";

import Server from "../../serverComms/server";
import Auth from "../../auth/auth";

export default function DisplayFullListing() {
	const navigate = useNavigate();

	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [found, setFound] = useState(false);
	const [loadingError, setLoadingError] = useState(null);
	const [error, setError] = useState(null);
	const [showError, setShowError] = useState(false);

	const [editAccess, setEditAccess] = useState(false);
	const [editing, setEditing] = useState(false);
	const [formValues, setFormValues] = useState(null);
	const [mod, setMod] = useState(false);
	const [admin, setAdmin] = useState(false);
	const [specialMessage, setSpecialMessage] = useState("");

	const { listingId } = useParams();
	const id = Number(listingId);
	
	useEffect(() => {
		let mounted = true;
		let listing = null;
		let editAccess = false;

		setLoading(true);
		Server.listings.getOne(id)
			.then(async (data) => {
				if (!mounted) return;
				if (!data.id) {
					console.error("no such listing");
					setLoadingError("There is no such listing.");
					setLoading(false);
					mounted = false;
					return;
				}

				listing = data;

				setFound(true);

				if (await Auth.loginState()) return Server.me();
			})
			.then(async (me) => {
				if (!mounted) return;

				console.log(me);

				if (me && (me.id === listing.seller_id || me.is_mod)) {
                    console.log("can edit");
					editAccess = true;
                    setEditAccess(true);

					if (listing.awaiting_moderation) {
						setSpecialMessage("This listing is awaiting moderation. \nOnly you and moderators can view it.")
					}
                } else {
                    console.log("cannot edit");
                }
				if (me && me.is_mod) setMod(true);
				if (me && me.is_admin) setAdmin(true);

				if (listing.awaiting_moderation && !editAccess) {
					console.error("not permitted to view at the moment");
					setLoadingError("You are not permitted to view this listing at the moment.");
					setLoading(false);
					mounted = false;
					return;
				}

				setListing(listing);
				setFormValues(listing);
				setLoading(false);
				
				
			})
			.catch((err) => {
				if (!mounted) return;
				setLoadingError(err);
				setLoading(false);
			});
		return () => { 
			mounted = false 
		};
	}, []);

	const handleSaveChanges = async (e) => {
		e.preventDefault();

		const changes = await JSON.stringify(listing) !== JSON.stringify(formValues);

		if (!changes) {
			console.log("no changes made");
			setEditing(false);
			return;
		}

		//phone validation
        const phone = (formValues.seller_phone !== "(not given)" ? formValues.seller_phone?.trim() : false);
        if (phone) {
            const phoneRegex = /^\+?[1-9]\d{7,14}$/;

            const normalized = phone.replace(/[\s()-]/g, "");

            if (!phoneRegex.test(normalized)) {
                console.error("Phone number is invalid");
                setError("Phone number is invalid.");
                setShowError(true);
                return;
            }
        }

		//general validation
        if (formValues.title === "") {
            setError("Title cannot be empty.");
            setShowError(true);
            setIsSubmitted(false);
            return;
        }
        if (formValues.price < 0) {
            setError("Price cannot be negative.");
            setShowError(true);
            setIsSubmitted(false);
            return;
        }
		if (formValues.price > 1000) {
            setError("Price is way too high.");
            setShowError(true);
            setIsSubmitted(false);
            return;
        }
        if (Math.round(formValues.price) !== Number(formValues.price)) {
            setError("Price has to be integer.");
            setShowError(true);
            setIsSubmitted(false);
            return;
        }
        if (formValues.description === "") {
            setError("Cannot have an empty description.");
            setShowError(true);
            setIsSubmitted(false);
            return;
        }
		if (formValues.description.length > 2000) {
            setError("Description is way too long.");
            setShowError(true);
            setIsSubmitted(false);
            return;
        }

		setListing(formValues);

		console.log("changes made");

		//formValues used

		console.log(formValues);

		console.log(listing.id);
		try {
			const toSend = {
				id: Number(listing.id),
				seller_id: Number(listing.seller_id),
				
				title: formValues.title,
				price: formValues.price,
				negotiable: formValues.negotiable,
				description: formValues.description,
				seller_email: formValues.seller_email !== "" ? formValues.seller_email : "(not given)",
				seller_phone: formValues.seller_phone !== "" ? formValues.seller_phone : "(not given)",
				email_show: (formValues.seller_email !== "(not given)" || formValues.seller_email !== "") ? formValues.email_show : false,
				phone_show: (formValues.seller_phone !== "(not given)" || formValues.seller_phone !== "") ? formValues.phone_show : false,
			}

			const response = await Server.listings.update(toSend);
			console.log(response);

			console.log("updated listing");

			setEditing(false);
		} catch (err) {
			console.error(err);
			setError(err);
			setShowError(true);
		}
	}

	//console.log(formValues);

	//moderator stuff
	const handleReject = async (id) => {
		if (!mod) return console.log("you aint mod buddy");
		if (!window.confirm("Confirm reject listing?")) return;
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
		if (!mod) return console.log("you aint mod buddy");
		if (!window.confirm("Confirm accept listing?")) return;
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
		if (!editAccess) return console.log("you aint mod buddy nor are you the creator of this listing");
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

	if (loading) return <div className="min-w-screen min-h-screen flex justify-center items-center text-gray-500">Loading...</div>
	if (loadingError) return <div className="min-w-screen min-h-screen flex justify-center items-center text-red-500">{loadingError}</div>
	if (!found) return <div className="min-w-screen min-h-screen flex justify-center items-center text-red-500">Listing not found.</div>

	const tags = listing.tags;
	const images = listing.images === null ? [] : listing.images;

	const setMainImage = (url) => {
		const mainImageElement = document.querySelector(".main-image");
		mainImageElement.src = url;
	}

	return (
		<>
		<div>
			<form onSubmit={handleSaveChanges}>
				<div className="flex justify-between">
					<Button color="bgless" type="button" className="mx-6 mt-4" onClick={() => { navigate(-1) }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
							<path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
						</svg>&nbsp;
						Back
					</Button>
					{editAccess ? (
						<Button color={editing ? "red" : "bgless"} className={editing ? "mx-6 mt-4 fixed right-0 z-100 border-2 border-white dark:border-(--darkborder)" : "mx-6 mt-4"} onClick={(e) => { 
							if (!editing) {
								setEditing(true);
							} else {
								e.target.form?.requestSubmit();
							}
						}}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
								<path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
								<path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
							</svg>&nbsp;
							{editing ? "Save" : "Edit"}
						</Button>
					) : (<></>)}
				</div>
				<div className={formValues.is_physical ? "min-w-screen min-h-screen p-6 flex flex-col lg:grid lg:grid-cols-2 gap-2" : "min-w-screen min-h-screen p-6 flex flex-col gap-2"}>
					{formValues.is_physical && (
						<div className="min-w-full">
							<div className="p-2 flex flex-col md:flex-row justify-start">
								<div className="flex md:flex-col flex-row gap-2 md:mr-2 mt-2 md:mt-0 order-last md:order-first max-w-full overflow-x-scroll md:overflow-x-hidden max-h-screen scrollbar-thumb-black md:[direction:rtl] scrollbar-thin pl-1">
									{images.length > 0 ? (
										images.map((image) => (
											<img className="w-15 h-15 aspect-square bg-gray-200 dark:bg-(--darksurface) rounded-lg hover:cursor-pointer opacity-80 hover:opacity-100" key={image} src={image} onClick={() => { setMainImage(image, this) }}/>
										))
									) : (
										<div className="w-15 h-15 bg-gray-200 rounded-lg flex justify-center items-center dark:bg-(--darksurface)">kein<br/>images</div>
									)}
								</div>
								{images.length > 0 ? (
									<img src={images[0]} className="main-image min-w-0 flex-1 aspect-square object-contain bg-white dark:bg-(--darksurface) rounded-lg" />
								) : (
									<div className="main-image min-w-0 flex-1 flex justify-center items-center aspect-square bg-white dark:bg-(--darksurface) rounded-lg">NO IMAGE</div>
								)}
								
							</div>
						</div>
					)}
					<div className="max-w-full min-w-full wrap-break-word">
						<div className="flex flex-col p-4">
							<div>
								{editAccess && specialMessage !== "" && (
									<p className="whitespace-pre-wrap text-red-600 mb-2">{specialMessage}</p>
								)}
								<div className="flex flex-col mb-6">
									{!formValues.is_physical && (<h1 className="text-md font-bold mb-0">Service</h1>)}
									{editing ? (
										<>
											<Label htmlFor="title">Title:</Label>
											<TextInput id="title" name="title" value={formValues.title} required 
												onChange={(e) => {
													setFormValues({
														...formValues,
														title: e.target.value
													});
												}}
												className={formValues.title.length > 60 ? "border-red-600 border-2 rounded-lg" : ""}
											/>
											<div className="flex justify-end">
												<p className={formValues.title.length > 60 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>{formValues.title.length}/60</p>
											</div>
										</>
									) : (
										<h1 className="text-4xl font-bold">{formValues.title}</h1>
									)}
								</div>
								<div className="flex mb-6">
									<h2 className="flex text-2xl font-semibold items-center">
										{editing ? (
											<div className="flex flex-col mb-2">
												<span className="text-3xl flex items-center gap-2">
													<span className="text-2xl">Price:</span>
													€
													<TextInput id="price" name="price" value={formValues.price} min="0" step="1" type="number" required 
														onChange={(e) => {
															setFormValues({
																...formValues,
																price: Number(e.target.value)
															});
														}}
														className={formValues.price > 1000 ? "border-red-600 border-2 rounded-lg" : ""}
													/>
													<div className="flex justify-end">
														<p className={formValues.price > 1000 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>max. €1000</p>
													</div>
												</span>
												<div className="flex items-center gap-1 text-xl">
													<Checkbox color="red" id="negotiable" name="negotiable" checked={formValues.negotiable} 
														onChange={(e) => {
															setFormValues({
																...formValues,
																negotiable: e.target.checked
															});
														}}
													/>
													<Label htmlFor="negotiable" className="text-red-600"><span className="text-sm font-bold text-red-700">Negotiable</span></Label>
												</div>
											</div>
										) : (
											<>
												Price:&nbsp;
												{listing.price === 0 ? (
													<span className="text-3xl">
														Free&nbsp;
													</span>
												) : (
													<span className="text-3xl">
														€{formValues.price}&nbsp;
													</span>
												)}
												{formValues.negotiable ? <span className="text-sm text-red-700 flex items-center">(negotiable)</span> : <></>}
											</>
										)}
									</h2>
								</div>
								<div className="mb-6">
									<h2 className="text-2xl font-semibold">Description:</h2>
									{editing ? (
										<>
											<Textarea id="description" name="description" value={formValues.description} rows={4} required
												onChange={(e) => {
													setFormValues({
														...formValues,
														description: e.target.value
													});
												}}
												className={formValues.description.length > 2000 ? "border-red-600 border-2 rounded-lg" : ""}
											/>
											<div className="flex justify-end">
												<p className={formValues.price > 1000 ? "text-red-600 text-sm" : "text-gray-500 text-sm"}>{formValues.description.length}/2000</p>
											</div>
										</>
									) : (
										<p className="whitespace-pre-wrap">{formValues.description}</p>
									)}
								</div>
								<div className=" flex mb-6 gap-2">
									{tags.length > 0 ? (
										tags.map((tag) => (
											<div className="border-solid border-gray-500 border rounded-2xl px-2" key={tag}>
												{tag}
											</div>
										))
									) : (
										<div className=""></div>
									)}
								</div>
								<div>
									<Button color="red" type="button" className="mt-4 bg-red-600 dark:bg-red-800 hover:bg-red-700 dark:hover:bg-red-900" onClick={() => { navigate(`/profile/${listing.seller_id}`) }}>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
											<path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
										</svg>&nbsp;
										Seller's profile
									</Button>
								</div>
								<div className="flex flex-col min-w-full gap-4 my-4">
									{editing ? (
										<>
										<div className="contact-card bg-red-700 dark:bg-red-900 text-white xl:w-1/2 w-full min-h-fit rounded-2xl overflow-x-hidden">
											<div className="min-w-full min-h-full rounded-2xl p-3">
												<h1 className="text-xl font-bold">Email:</h1>
												<TextInput id="email" name="email" value={formValues.seller_email || ""} 
													onChange={(e) => {
														setFormValues({
															...formValues,
															seller_email: e.target.value
														});
													}}
												/>
											</div>
											<div className="flex items-center gap-1 text-xl pl-4 mb-4">
												<Checkbox color="red" id="showEmail" name="showEmail" checked={formValues.email_show} 
													onChange={(e) => {
														setFormValues({
															...formValues,
															email_show: e.target.checked
														});
													}}
												/>
												<Label htmlFor="showEmail"><span className="text-sm text-white">Show email</span></Label>
											</div>
										</div>
										<div className="contact-card bg-green-700 dark:bg-green-900 text-white xl:w-1/2 w-full min-h-fit rounded-2xl overflow-x-hidden">
											<div className="min-w-full min-h-full rounded-2xl p-3">
												<h1 className="text-xl font-bold">Phone number:</h1>
												<TextInput id="phone" name="phone" value={formValues.seller_phone || ""} 
													onChange={(e) => {
														setFormValues({
															...formValues,
															seller_phone: e.target.value
														});
													}}
												/>
											</div>
											<div className="flex items-center gap-1 text-xl pl-4 mb-4">
												<Checkbox color="red" id="showPhone" name="showPhone" checked={formValues.phone_show} 
													onChange={(e) => {
														setFormValues({
															...formValues,
															phone_show: e.target.checked
														});
													}}
												/>
												<Label htmlFor="showPhone"><span className="text-sm text-white">Show phone</span></Label>
											</div>
										</div>
										</>
									) : (
										<>
											{formValues.email_show && formValues.seller_email ? (
												<div className="contact-card bg-red-700 dark:bg-red-900 text-white xl:w-1/2 w-full min-h-20 rounded-2xl overflow-x-hidden">
													<Link to={`mailto:${formValues.seller_email}`}>
														<div className="min-w-full min-h-full rounded-2xl p-3">
															<h1 className="text-xl font-bold">Email:</h1>
															<p className="wrap-break-word">{formValues.seller_email}</p>
														</div>
													</Link>
												</div>
											) : (<></>)}
											{formValues.phone_show && formValues.seller_phone ? (
												<div className="contact-card bg-green-700 dark:bg-green-900 text-white xl:w-1/2 w-full min-h-20 rounded-2xl overflow-x-hidden">
													<Link to={`phone:${formValues.seller_phone}`}>
														<div className="min-w-full min-h-full rounded-2xl p-3">
															<h1 className="text-xl font-bold">Phone number:</h1>
															<p className="wrap-break-word">{formValues.seller_phone}</p>
														</div>
													</Link>
												</div>
											) : (<></>)}
										</>
									)}
								</div>
							</div>
							{editAccess && (
								<>
									<HR className="my-2" />
									<div className="flex gap-2 justify-end z-10">
										<div className="flex gap-2">
											{(mod || admin) && (
												<div className="flex gap-2">
													{listing.awaiting_moderation && (
														<Button color="red" className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
															onClick={() => { handleAccept(listing.id) }}
														>
															Accept
														</Button>
													)}
													<Button color="red"
														onClick={() => { handleReject(listing.id) }}
													>
														Reject
													</Button>
												</div>
											)}
											<Button color="red"
												onClick={() => { handleDelete(listing.id) }}
											>
												Delete
											</Button>
										</div>
									</div>
								</>
							)}
							<div className="other mt-20">
								<p className="text-[12px] text-gray-500">ID: {listing.id} | Created: {listing.created_at} | Seller ID: {listing.seller_id} | Physical: {String(listing.is_physical)}</p>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
		<div className="absolute z-9999">
			{error && showError && (
				<div className="min-w-screen fixed flex top-0 left-0 p-4">
					<Toast>
						{error}
						<ToastToggle onDismiss={() => setShowError(false)} />
					</Toast>
				</div>
			)}
		</div>
		</>
	);
}