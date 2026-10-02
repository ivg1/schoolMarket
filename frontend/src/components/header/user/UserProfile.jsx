import {
	Avatar,
	Dropdown,
	DropdownHeader,
	DropdownDivider,
	DropdownItem,
} from "flowbite-react";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Auth from "../../../auth/auth";
import Data from "../../../auth/data";

export default function UserProfile() {
	const navigate = useNavigate();

	const [me, setMe] = useState(null);

	useEffect(() => {
		const getMe = async () => {
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
		<Dropdown
			label={
				<div className="w-11 h-11 rounded-full overflow-hidden mr-2">
                    <img
                        src={ (me && me.profile_image !== null) ? me.profile_image : "/placeholderProfile.png" }
                        alt="Profile picture"
						className="w-full h-full object-cover"
            		/>
            	</div>
			}
			arrowIcon={false}
			inline
			
		>
			<DropdownHeader>
				<span className="block text-l  text-center">{me?.username ?? "Guest"}</span>
			</DropdownHeader>
			<DropdownDivider />
			{/* here im thinking better store the me, so that u dont have to fetch it every time */}
			<DropdownItem className="relative"> {/* onClick={() => { if (me) navigate(`/profile/${me.id}`); }} */}
				{ me && (
					<a href={`/profile/${me.id}`} className="no-underline m-0 p-0 w-full h-full absolute top-0 left-0 z-2"></a>
				)}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mr-2">
					<path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
				</svg>
				Profile
			</DropdownItem>
			<DropdownItem className="relative">
				<a href={`/dashboard`} className="no-underline m-0 p-0 w-full h-full absolute top-0 left-0 z-2"></a>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mr-2">
					<path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
					<path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
				</svg>
				Dashboard
			</DropdownItem>
			<DropdownItem className="relative">
				<a href={`/messenger`} className="no-underline m-0 p-0 w-full h-full absolute top-0 left-0 z-2"></a>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mr-2">
					<path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
				</svg>
				Messages
			</DropdownItem>
			<DropdownItem className="relative">
				<a href={`/settings`} className="no-underline m-0 p-0 w-full h-full absolute top-0 left-0 z-2"></a>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mr-2">
					<path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
				</svg>
				Settings
			</DropdownItem>
			{me && (me.is_mod || me.is_admin) ? (
				<DropdownItem className="relative">
					<a href={`/moderation`} className="no-underline m-0 p-0 w-full h-full absolute top-0 left-0 z-2"></a>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mr-2">
						<path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
					</svg>
					For Mods
				</DropdownItem>
			) : (<></>)}
			<DropdownDivider />
			<DropdownItem className="flex justify-between" onClick={() => { Auth.deleteToken(); Data.deleteMe(); window.location.reload() }}>
				Logout
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 ml-2">
					<path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
				</svg>

			</DropdownItem>
		</Dropdown>
	)
}