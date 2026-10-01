import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center px-10 pb-60">
                <div className="explanation flex flex-col items-center mb-20">
                    <div>
                        <h1 className="text-8xl font-bold my-20 flex flex-col md:items-end dark:text-(--darktext)">
                            Privacy Policy
                        </h1>
                    </div>
                    <div className="flex flex-col gap-8 md:px-10 max-w-300">
                        <div className="text-left">
                            <p className="text-2xl mb-8">
                                School Market (SM) is made by a privacy enthusiast.<br />
                                We only collects and stores the data you give us that is necessary to operate the platform.
                            </p>
                            <div>
                                <div className="mb-8">
                                    <h1 className="text-3xl mb-2">
                                        How We Use Your Information
                                    </h1>
                                    <p className="mb-2">
                                        We use the collected data to:
                                    </p>
                                    <ul className="list-disc ml-5">
                                        <li>Provide a working account system.</li>
                                        <li>Display listings.</li>
                                        <li>Investigate reports of rule violations, fraud, or misuse.</li>
                                    </ul>
                                </div>
                                <div className="mb-8">
                                    <h1 className="text-3xl mb-2">
                                        Data Sharing
                                    </h1>
                                    <p className="mb-2">
                                        We don't sell any data to anyone.
                                    </p>
                                    <p className="mb-2">
                                        Information you include in listings is public, and can be accessed by other users of the platform.
                                    </p>
                                    <p>
                                        SM may also disclose information when required by a school, or to ensure safety of the platform and its users.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}