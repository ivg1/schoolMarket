import { Button, Card, HRTrimmed, Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";

import Animations from "../../components/animations/animations.jsx";

import CountUpModule from "react-countup";
const CountUp = CountUpModule.default;

import Server from "../../serverComms/server.jsx";

import { motion } from "framer-motion";

export default function Landing() {
    const navigate = useNavigate();

    const [numUsers, setNumUsers] = useState(0);
    const [numListings, setNumListings] = useState(0);

    const [inView, setInView] = useState(false);
    const inViewRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        Server.users.numUsers()
            .then(async (data) => {
                if (!mounted) return;
                setNumUsers(data.count);

                return Server.listings.getNum();
            })
            .then((data) => {
                if (!mounted) return;
                setNumListings(data.total_listings_created);
            })

        return () => {
            mounted = false;
        }
    }, []);

    useEffect(() => {
        const el = inViewRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
            }
        },
        { threshold: 0.2 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="landing-page smooth-trans">
            <div className="hero min-h-170 flex items-center justify-center md:px-10">
                <Animations.FloatUp8>
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl lg:px-0 px-6 font-bold text-slate-900 dark:text-white max-w-200">Find what you need.<br />Sell what you don't.<br />All in one place.</h1>
                        <Animations.FloatUp8 delay={0.05}>
                            <p className="py-6 text-slate-700 dark:text-gray-400 lg:px-0 px-6">
                                Find the materials used in <u>your</u> school and classes.<br />
                            </p>
                        </Animations.FloatUp8>
                        <div className="flex justify-center gap-4  p-4 z-5">
                            <Button pill color="alternative" size="lg" onClick={() => navigate("/about")}>Learn more</Button>
                            <Button pill color="red" size="lg" onClick={() => navigate("/listings")}>Explore listings</Button>
                        </div>
                    </div>
                </Animations.FloatUp8>
            </div>
            <div className="explanation min-h-fit w-full flex md:px-10 sm:px-5 mb-10">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-2 min-h-full min-w-full text-center px-2">
                    <Animations.FloatUp4>
                        <Card className="max-w-full max-h-200 m-2 p-0px text-left dark:bg-(--darksurface) dark:border-(--darkborder)">
                            <div className="flex align-center">
                                <div className="flex justify-center align-center items-center mr-4 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="md:size-10 size-8">
                                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                    </svg>
                                </div>
                                <h5 className="md:text-2xl text-l text-gray-900 dark:text-white min-w-fit flex justify-center">
                                    Made by students,<br /> for students.
                                </h5>
                            </div>
                            <p className="min-h-22 font-normal text-gray-700 dark:text-gray-400">Made by a student to make finding and sharing resources & services easier for fellow students.</p>
                        </Card>
                    </Animations.FloatUp4>
                    <Animations.FloatUp4 delay={0.15}>
                        <Card className="max-w-full max-h-200 m-2 p-0px text-left dark:bg-(--darksurface) dark:border-(--darkborder)">
                            <div className="flex align-center">
                                <div className="flex justify-center align-center items-center mr-4 text-red-600">
                                    {/*}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="md:size-10 size-8">
                                        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
                                    </svg>
                                    */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="md:size-10 size-8">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                    </svg>
                                </div>
                                <h5 className="md:text-2xl text-l text-gray-900 dark:text-white min-w-fit flex justify-center">
                                    Help others <br />paid or free.
                                </h5>
                            </div>
                            <p className="min-h-22 font-normal text-gray-700 dark:text-gray-400">Help other students from your school by offering books you no longer need, or provide services to them.</p>
                        </Card>
                    </Animations.FloatUp4>
                    <Animations.FloatUp4 delay={0.3}>
                        <Card className="max-w-full max-h-200 m-2 p-0px text-left dark:bg-(--darksurface) dark:border-(--darkborder)">
                            <div className="flex align-center">
                                <div className="flex justify-center align-center items-center mr-4 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="md:size-10 size-8">
                                        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h5 className="md:text-2xl text-l text-gray-900 dark:text-white min-w-fit flex justify-center">
                                    Every transaction is physical. <br /> You're in control.
                                </h5>
                            </div>
                            <p className="min-h-22 font-normal text-gray-700 dark:text-gray-400">Everything you give or receive is done physically, after messaging with the other seller, ensuring you get what you expect.</p>
                        </Card>
                    </Animations.FloatUp4>
                </div>
            </div>
            <div className="mb-8">
                <div className="bg-white dark:bg-(--darksurface) min-w-full min-h-40 flex flex-col sm:flex-row sm:divide-x sm:dark:divide-(--darkborder) divide-gray-300 py-4 items-center justify-center">
                    <div className="flex flex-col items-center p-4 px-8">
                        <h1 className="text-3xl font-bold ">Existing Users</h1>
                        <p className="text-8xl font-bold text-red-600" ref={inViewRef}>
                            {inView ? (
                                <CountUp end={numUsers} duration={4} start={0} />
                            ) : (
                                0
                            )}
                        </p>
                    </div>
                    <div className="flex flex-col items-center p-4 px-8">
                        <h1 className="text-3xl font-bold ">Created Listings</h1>
                        <p className="text-8xl font-bold text-red-600" ref={inViewRef}>
                            {inView ? (
                                <CountUp end={numListings} duration={4} start={0} />
                            ) : (
                                0
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="process-steps flex flex-col gap-4 min-w-full min-h-fit p-10 mb-10">
                <div className="step1 md:grid md:grid-cols-2 gap-4 min-h-fit flex flex-col">
                    <div className="flex justify-center items-center w-full">
                        <Animations.FloatUp2 delay={0.1}>
                            <img src="/steps/step1.png" className="steps-image-holder flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col text-left text-ellipsis max-h-100 max-w-full" />
                        </Animations.FloatUp2>
                    </div>
                    <div className="steps-text-holder p-10 md:order-last order-first">
                        <Animations.FloatUp4>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white p-2">1. Create an account.</h2>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Sign up with your email to get access to the platform and start exploring.</p>
                        </Animations.FloatUp4>
                    </div>
                </div>
                <div className="step2 md:grid md:grid-cols-2 gap-4 min-h-fit flex flex-col">
                    <div className="steps-text-holder p-10 md:order-first order-first">
                        <Animations.FloatUp4>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white p-2">2. Explore/Create listings.</h2>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Browse through existing listings or create your own to show your goods or services.</p>
                        </Animations.FloatUp4>
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <Animations.FloatUp4 delay={0.1}>
                            <img src="/steps/step2.png" className="steps-image-holder flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col text-left text-ellipsis max-h-100 max-w-full" />
                        </Animations.FloatUp4>
                    </div>
                </div>
                <div className="step3 md:grid md:grid-cols-2 gap-4 min-h-fit flex flex-col">
                    <div className="flex justify-center items-center w-full">
                        <Animations.FloatUp4 delay={0.1}>
                            <img src="/steps/step3.png" className="steps-image-holder flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col text-left text-ellipsis max-h-100 max-w-full" />
                        </Animations.FloatUp4>
                    </div>
                    <div className="steps-text-holder p-10 md:order-last order-first">
                        <Animations.FloatUp4>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white p-2">3. Contact the seller.</h2>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Once you find something you like, reach out to the seller through the listed contact info, and discuss details such as final price and meeting place.</p>
                        </Animations.FloatUp4>
                    </div>
                </div>
                <div className="step4 md:grid md:grid-cols-2 gap-4 min-h-fit flex flex-col">
                    <div className="steps-text-holder p-10 md:order-first order-first">
                        <Animations.FloatUp4>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white p-2">4. Meet up.</h2>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Once both parties agree, meet up at the agreed location to complete the exchange.</p>
                        </Animations.FloatUp4>
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <Animations.FloatUp4 delay={0.1}>
                            <img src="/steps/step4.png" className="steps-image-holder flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col text-left text-ellipsis max-h-100 max-w-full" />
                        </Animations.FloatUp4>
                    </div>
                </div>
            </div>
            <HRTrimmed />
            <div className="contact-us flex flex-col gap-4 min-w-full min-h-fit p-10 mb-10 justify-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">FAQ</h1>
                <div className="min-w-full">
                    <Animations.Appear8>
                    <Accordion collapseAll alwaysOpen className="">
                        <AccordionPanel>
                            <AccordionTitle>Is this service free?</AccordionTitle>
                            <AccordionContent>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                    Yes.
                                </p>
                            </AccordionContent>
                        </AccordionPanel>
                        <AccordionPanel>
                            <AccordionTitle>How do I create a listing?</AccordionTitle>
                            <AccordionContent>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                    Create an account. Then click on "Create Listing" button on top left corner of the listings page.
                                </p>
                            </AccordionContent>
                        </AccordionPanel>
                        <AccordionPanel>
                            <AccordionTitle>What can I list on this platform?</AccordionTitle>
                            <AccordionContent>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                    Literally anything that doesn't violate our terms of service is listable. The things can be both services (e.g. homework help or tutoring) and physical things (e.g. textbooks).
                                </p>
                            </AccordionContent>
                        </AccordionPanel>
                        <AccordionPanel>
                            <AccordionTitle>How do I message the seller?</AccordionTitle>
                            <AccordionContent>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                    Either through the soon to be made messenger, or through contact info provided in their listing.
                                </p>
                            </AccordionContent>
                        </AccordionPanel>
                        <AccordionPanel>
                            <AccordionTitle>Is it safe to buy/sell on this platform?</AccordionTitle>
                            <AccordionContent>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                    We have a moderation system so should be fine, and all transactions are done physically.
                                </p>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                    </Animations.Appear8>
                </div>
            </div>
        </div>
    )
}