import { Link } from "react-router-dom";

export default function About() {
    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center px-10 pb-60">
                <div className="explanation flex flex-col items-center mb-20">
                    <div>
                        <h1 className="text-8xl font-bold my-20 flex flex-col md:items-end dark:text-(--darktext)">
                            About
                            <span className="m-0 text-[12px]">(What this is)</span>
                        </h1>
                    </div>
                    <div className="flex flex-col ">
                        <div className="flex flex-col max-w-300">
                            <p className="text-2xl mb-10">
                                The School Market (SM) is a platform developed with the aim to make it <span className="text-red-700">easier</span> for students to search for what they need and show their goods or services.
                            </p>
                            <p className="text-2xl">
                                SM provides everything students need to begin using this platform for <span className="text-red-700">free</span>:
                            </p>
                            <p className="text-lg">
                                A working listings system, accounts system, built-in messenger (soon), and statistics (soon).
                            </p>
                        </div>
                    </div>
                </div>
                <div className="meet-team flex flex-col items-center">
                    <div>
                        <h1 className="text-8xl font-bold my-20 flex flex-col md:items-end dark:text-(--darktext)">
                            Meet the Team
                            <span className="m-0 text-[12px]">(There is only one person)</span>
                        </h1>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 mb-6 max-w-300">
                        <div className="member-card flex flex-col justify-center items-center rounded-lg border border-gray-200 bg-white shadow-md dark:border-(--darkborder) dark:bg-[#0D0D0D] text-left text-ellipsis min-h-100 min-w-80 px-4">
                            <img draggable="false" src="/theCreatorProfile.png" alt="my boy ivg1 (the creator)" className="max-w-50 m-5 rounded-[50%]" />
                            <h2 className="font-bold text-4xl mb-1">ivg1</h2>
                            <p className="text-sm text-gray-500 mb-2"></p>
                            <div>
                                <p className="text-gray-600 dark:text-(--darktext-secondary) text-center">
                                    Programmer (fullstack),<br />
                                    Made the entire app.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*
            <p className="my-10 text-center">
                SM is fully <Link className="text-red-600 hover:underline" to="https://github.com/ivg1/theHeritageMarket/">opensource</Link>
            </p>
            */}
        </div>
    )
}