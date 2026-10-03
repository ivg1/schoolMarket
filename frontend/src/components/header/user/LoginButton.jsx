import { Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

export default function LoginButton() {
	const navigate = useNavigate();

	const returnUrl = window.location.pathname;

	return (
		<Button color="light" className="px-4 mx-2" onClick={() => navigate("/login?returnUrl=" + encodeURIComponent(returnUrl))}>
			Login
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 ml-2">
				<path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6Zm-5.03 4.72a.75.75 0 0 0 0 1.06l1.72 1.72H2.25a.75.75 0 0 0 0 1.5h10.94l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 0Z" clipRule="evenodd" />
			</svg>

		</Button>
	)
}