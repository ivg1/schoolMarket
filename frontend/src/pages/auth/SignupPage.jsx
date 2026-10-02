import { Button, Checkbox, Label, TextInput, useThemeMode, Toast, ToastToggle, HelperText } from "flowbite-react";
import "./SignupPage.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react"

import Server from "../../serverComms/server";

export default function SignupPage() {
    const navigate = useNavigate();

    const { computedMode, toggleMode } = useThemeMode();
    const isDarkMode = computedMode === "dark";

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(true);

    const [shown, setShown] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        console.log(values);

        if (values.password !== values["password-repeat"]) {
            console.error("passwords do not match");
            setError("Passwords do not match.");
            setShowError(true);
            return;
        }
        if (formData.get("agree") !== "on") {
            console.error("user didnt agree to terms");
            setError("Didnt agree to terms & conditions.");
            setShowError(true);
            return;
        }

        //password validation
        if (values.password.length < 8) {
            console.error("password must be 8 or more characters");
            setError("Password must be 8 or more characters.");
            setShowError(true);
            return;
        }
        let characters = /[!@#$%^&*\/+\-_.?]/;
        if (!characters.test(values.password)) {
            console.error("password must include at least 1 symbol");
            setError("Password must include at least 1 symbol (!,@,#,$,%,^,&,*,/,+,-).");
            setShowError(true);
            return;
        }

        //phone validation
        const phone = values.phone?.trim();
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

        if (values.fname.length > 20) {
            console.error("First name too long.");
            setError("First name too long (max. 20char).");
            setShowError(true);
            return;
        }
        if (values.lname.length > 20) {
            console.error("Last name too long.");
            setError("Last name too long (max. 20char).");
            setShowError(true);
            return;
        }
        if (values.username.length > 20) {
            console.error("Username too long.");
            setError("Username too long (max. 20char).");
            setShowError(true);
            return;
        }
        if (values.email.length > 40) {
            console.error("Email too long.");
            setError("Email too long (max. 40char).");
            setShowError(true);
            return;
        }

        

        const toSend = {
            username: values.username,
            email: values.email,
            password: values.password,
            phone: values.phone,
            fname: values.fname,
            lname: values.lname,
        };

        try {
            const response = await Server.auth.signup(toSend);
            console.log("signup response", response);
            navigate("/login");
        } catch (err) {
            console.error("signup failed", err);
            setError("User already exists with that username or email.");
            setShowError(true);
        }
    };

    return (
        <>
            <div className="auth-container min-w-screen min-h-screen flex items-center justify-center sm:py-10">
                <div className="auth-holder w-screen h-fit sm:w-100 sm:h-fit bg-white dark:bg-black sm:rounded-2xl px-4 pt-8 sm:border-solid sm:border-2 dark:border-(--darkborder) border-gray-200">
                    <div className="flex flex-col justify-center mb-6">
                        <h1 className="text-4xl font-bold text-center mb-2">Sign Up</h1>
                    </div>
                    <form className="flex min-w-full flex-col gap-4" id="register-form" onSubmit={handleSubmit}>
                        <div className="form-item">
                            <div className="mb-2 block">
                                <Label htmlFor="fname">First name:&nbsp;<span className="text-red-600">*</span></Label>
                            </div>
                            <TextInput id="fname" name="fname" type="text" placeholder="John" required shadow />
                        </div>
                        <div className="form-item">
                            <div className="mb-2 block">
                                <Label htmlFor="lname">Last name:&nbsp;<span className="text-red-600">*</span></Label>
                            </div>
                            <TextInput id="lname" name="lname" type="text" placeholder="Doe" required shadow />
                        </div>
                        <div className="form-item">
                            <div className="mb-2 block">
                                <Label htmlFor="username">Username:&nbsp;<span className="text-red-600">*</span></Label>
                            </div>
                            <TextInput id="username" name="username" type="text" placeholder="user1234" required shadow />
                        </div>
                        <div className="form-item">
                            <div className="mb-2 block">
                                <Label htmlFor="email">Email:&nbsp;<span className="text-red-600">*</span></Label>
                            </div>
                            <TextInput id="email" name="email" type="email" placeholder="test@market.ivg1.dev" required shadow />
                        </div>
                        <div className="form-item">
                            <div className="mb-2 block">
                                <Label htmlFor="phone">Phone number:&nbsp;<span className="text-gray-500">(optional)</span></Label>
                            </div>
                            <TextInput id="phone" name="phone" type="tel" placeholder="+123 45 67890" shadow />
                        </div>
                        <div className="form-item">
                            <div className="mb-2 block">
                                <Label htmlFor="password">Password:&nbsp;<span className="text-red-600">*</span></Label>
                            </div>
                            <div className="relative">
                                <TextInput id="password" name="password" type={shown ? "text" : "password"} placeholder="••••••••" required shadow />
                                <div onClick={() => shown ? setShown(false) : setShown(true)} className="absolute inset-y-0 right-2 flex items-center">
									{shown ? (
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
											<path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
											<path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
											<path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
											<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
											<path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
										</svg>
									)}
								</div>
                            </div>
                            <ul className="list-disc px-4 mt-2 text-gray-400 text-sm">
                                <li>Must be 8 or more characters</li>
                                <li>Must include a symbol (!,@,#,$,%,^,&,*,/,+,-)</li>
                            </ul>
                        </div>
                        <div className="form-item">
                            <div className="mb-2 block">
                                <Label htmlFor="password-repeat">Repeat password:&nbsp;<span className="text-red-600">*</span></Label>
                            </div>
                            <TextInput id="password-repeat" name="password-repeat" type="password" placeholder="••••••••" required shadow />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="agree" name="agree" color="red" />
                            <Label htmlFor="agree" className="flex items-center">
                                I agree with the&nbsp;
                                <Link to="/legal/terms-of-service" target="_blank" className="text-red-600 hover:underline">
                                    terms of service
                                </Link>
                                &nbsp;and&nbsp;
                                <Link to="/legal/privacy-policy" target="_blank" className="text-red-600 hover:underline">
                                    privacy policy
                                </Link>
                            </Label>
                        </div>
                        <Button type="submit" color="red">Sign up</Button>
                    </form>
                    <div className="text-center flex justify-center text-sm my-4">
                            <p>Have an account?</p>&nbsp;<Link to="/login" className="text-red-600 hover:underline">Login</Link>
                    </div>
                </div>
                
            </div>
            <div className="accessibility-corner absolute right-0 top-0 p-4">
                <Button
                        type="button"
                        color="bglessOnlytext"
                        pill
                        className=""
                        onClick={toggleMode}
                        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
                            </svg>
                        )}
                    </Button>
            </div>
            <div className="gohome-corner absolute left-0 top-0 p-4">
                <Link to="/"><img draggable="false" src="/favicon.png" className="mr-3 h-12"></img></Link>
            </div>
            {error && showError && (
				<div className="min-w-screen fixed flex top-0 left-0 p-4">
					<Toast>
                        {error}
                        <ToastToggle onDismiss={() => setShowError(false)} />
                    </Toast>
				</div>
			)}
            
        </>
    )
}