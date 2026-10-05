import { Blockquote } from "flowbite-react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from "react";

import Data from "../../auth/data";
import Auth from "../../auth/auth";

export default function Footer() {

    const [me, setMe] = useState(null);
    useEffect(() => {
		const getMe = async () => {
            const loginState = await Auth.loginState();
            if (!loginState) {
                console.log("user not logged in");
                return;
            }
            
			try {
				const me = await Data.me();
				//console.log(me);
				if (!me) throw new Error("it seems u dont exist yet");

				setMe(me);
			} catch (err) {
				console.error(err);
			}
		}
		getMe();
	}, [])

    return (
        <div className="footer border-t border-slate-200 bg-white text-slate-900 p-10 min-h-fit h-100 max-w-screen dark:border-(--darkborder) dark:bg-(--darkbg) dark:text-white smooth-trans">
            <div className="footer-content flex flex-col lg:flex-row justify-between items-center mb-10">
                <div className="footer-logo flex items-center mb-4 md:mb-0">
                    <img draggable="false" src="/favicon.png" alt="School Market Logo" className="h-20 mr-2" />
                    <span className="text-2xl font-bold">School Market</span>
                </div>
                <div className="quotation lg:m-0 mt-4">
                    <Blockquote className="text-lg font-normal text-slate-600 flex flex-col dark:text-gray-400">
                        <div className="text-lg font-normal text-slate-600 flex flex-col dark:text-gray-400">
                        "The only way to do great work is to love what you do." <br /><span className="text-right">- Steve Jobs</span>
                        </div>
                    </Blockquote>
                </div>
            </div>
            <div className="footer-links md:grid lg:grid-cols-7 md:grid-cols-5 sm:flex sm:flex-col sm:align-center gap-4">
                <div className="link-group flex flex-col m-2 mb-6">
                    <h1 className="text-xl font-bold mb-2">Links</h1>
                    <Link to="/" className="text-slate-600 hover:text-red-600 dark:text-gray-400">Home</Link>
                    <Link to="/listings" className="text-slate-600 hover:text-red-600 dark:text-gray-400">Listings</Link>
                    <Link to="/messenger" className="text-slate-600 hover:text-red-600 dark:text-gray-400">Messenger</Link>
                    {me && (<Link to="/settings" className="text-slate-600 hover:text-red-600 dark:text-gray-400">Settings</Link>) }
                    <Link to="/about" className="text-slate-600 hover:text-red-600 dark:text-gray-400">About Us</Link>
                    {/* <Link to="/support" className="text-slate-600 hover:text-red-600 dark:text-gray-400">Support</Link> */}
                </div>
                <div className="link-group flex flex-col m-2 mb-6">
                    <h1 className="text-xl font-bold mb-2">Legal</h1>
                    <Link to="/legal/terms-of-service" className="text-slate-600 hover:text-red-600 dark:text-gray-400">Terms of Service</Link>
                    <Link to="/legal/privacy-policy" className="text-slate-600 hover:text-red-600 dark:text-gray-400">Privacy Policy</Link>
                    <Link to="/legal/relation-to-school" className="text-slate-600 hover:text-red-600 dark:text-gray-400">Relation to school</Link>
                </div>
                <div className="link-group flex flex-col m-2 mb-6">
                    <h1 className="text-xl font-bold mb-2">Contact us</h1>
                    <p className="text-slate-600 dark:text-gray-400">Email:<br /> <Link to="mailto:admin@market.ivg1.dev" className="text-red-600 hover:text-red-500">admin@market.ivg1.dev</Link></p>
                    <p className="text-slate-600 dark:text-gray-400">Phone:<br /> <Link to="tel:+00000000000" className="text-red-600 hover:text-red-500">+00000000000</Link></p>
                </div>
            </div>
            <p className="mt-10 text-center flex items-center justify-center">
                Made with
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-red-600 mx-1">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                and&nbsp;
                <Link className="text-red-600 hover:underline" to="https://github.com/ivg1/schoolMarket/">opensource</Link>
            </p>
        </div>
    )
}