import "./Header.css";
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
    useThemeMode,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import UserProfile from "./user/UserProfile";
import LoginButton from "./user/LoginButton";
import Auth from "../../auth/auth";

export default function Header() {
    const { computedMode, toggleMode } = useThemeMode();
    const isDarkMode = computedMode === "dark";
    
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        let isMounted = true;

        Auth.loginState().then((status) => {
            if (isMounted) {
                setIsLoggedIn(status);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [location.pathname]);

    return (
        <Navbar className="header py-2 px-5 min-w-screen smooth-trans fixed z-4000">
            <NavbarBrand href="/">
                <img draggable="false"src="/favicon.png" className="mr-3 h-12" alt="School Market Logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white hidden md:flex ">School Market</span>
            </NavbarBrand>
            <div className="flex md:order-2 items-center">
                <Button
                    type="button"
                    color="bglessOnlytext"
                    pill
                    className="mr-2"
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
                {isLoggedIn ? <UserProfile /> : <LoginButton />}
                <NavbarToggle className="ml-2" />
                
            </div>
            <NavbarCollapse className="flex-row">
                <NavbarLink href="/listings">Listings</NavbarLink>
                <NavbarLink href="/messenger">Messenger</NavbarLink>
                <NavbarLink href="/about">About</NavbarLink>
                {/* <NavbarLink href="/support">Support</NavbarLink> */}
            </NavbarCollapse>
        </Navbar>
    );
} 