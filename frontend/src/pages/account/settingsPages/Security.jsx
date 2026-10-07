import Server from "../../../serverComms/server";
import Data from "../../../auth/data";
import Auth from "../../../auth/auth";

import { 
    Button, 
    Checkbox, 
    Label, 
    TextInput, 
    useThemeMode, 
    Toast, 
    ToastToggle,
    HR,
    Textarea,
    HelperText
} from "flowbite-react";

import { useState, useEffect } from "react";

export default function Security({ details, loading, loadingError}) {
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [successPassReset, setSuccessPassReset] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [submittingDelete, setSubmittingDelete] = useState(false);
    const [password, setPassword] = useState("");

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessPassReset(false);
        setShowError(false);

        console.log("started reset password process");

        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData);
        console.log(values);

        if (values.newPassword !== values.repeatNewPassword) {
            console.error("New password doesnt match repeated password.")
            setError("New password doesnt match repeated password.");
            setShowError(true);
            setSubmitting(false);
            return; 
        }
        if (values.newPassword === values.oldPassword) {
            console.error("New password must not be the same as old one.")
            setError("New password must not be the same as old one.");
            setShowError(true);
            setSubmitting(false);
            return;
        }
        if (values.newPassword.length < 8) {
            console.error("password must be 8 or more characters");
            setError("Password must be 8 or more characters.");
            setShowError(true);
            setSubmitting(false);
            return;
        }
        let characters = /[!@#$%^&*/+-_]/;
        if (!characters.test(values.newPassword)) {
            console.error("password must include at least 1 symbol");
            setError("Password must include at least 1 symbol (!,@,#,$,%,^,&,*,/,+,-,_).");
            setShowError(true);
            setSubmitting(false);
            return;
        }

        try {
            const toSend = {
                old_password: values.oldPassword,
                new_password: values.newPassword
            };

            const response = await Server.users.private.resetPass(toSend);

            console.log("password updated");
        } catch (err) {
            console.error("Error resetting password.", err);
            setError(String(err));
            setShowError(true);
            setSubmitting(false);
            return;
        }

        Data.me(true);
        setSubmitting(false);
        setSuccessPassReset(true);
    }

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();

        if (!window.confirm("Are you sure you want to delete your account?")) {
            setError("Account deletion cancelled.");
            setShowError(true);
            return;
        }

        if (password.trim().length === 0) {
            setError("Password cannot be empty.");
            setShowError(true);
            return;
        }

        setSubmittingDelete(true);
        console.log("started process deleting user");

        const me = await Data.me(true);
        const id = me.id;

        try {
            const toSend = {
                id: id,
                password: password.trim()
            };

            const response = await Server.users.danger.delete(toSend);
            console.log("deleted user");
            
            Auth.deleteToken();
            Data.deleteMe();
            window.location.href = "/";

        } catch (err) {
            setError(String(err));
            setShowError(true);
        }

        setSubmittingDelete(false);
    }
    

    if (loading) return <div className="min-w-full min-h-full flex justify-center items-center text-gray-500">Loading...</div>
	if (loadingError) return <div className="min-w-full min-h-full flex justify-center items-center text-red-500">{loadingError}</div>
    if (!details) return <div className="min-w-full min-h-full flex justify-center items-center text-gray-500">Trying to fetch details.</div>

    return (
        <div className="security-container">
            <h1 className="text-3xl font-bold ml-2 mb-6">Security</h1>
            <div className="sm:pl-10">
                <div className="security">
                    {/* <h1 className="text-2xl font-bold mb-2">Personal</h1> */}
                    <form onSubmit={handlePasswordSubmit}>
                        <div>
                            <h1 className="text-2xl font-bold ml-2 mb-2">Password reset</h1>
                            <div className="flex gap-4 mb-4 flex-col dark:border-(--darkborder) border border-gray-200 p-4 rounded-2xl ">
                                {successPassReset ? (
                                    <div>
                                        <p className="text-green-400">Password updated.</p>
                                    </div>
                                ) : (<></>)}
                                <div className="flex gap-4 items-center flex-col sm:flex-row max-w-fit">
                                    <div className="form-item">
                                        <div className="block mb-2">
                                            <Label htmlFor="oldPassword">Current password:</Label>
                                        </div>
                                        <TextInput id="oldPassword" name="oldPassword" type="password" />
                                    </div>
                                    <div className="form-item">
                                        <div className="block mb-2">
                                            <Label htmlFor="newPassword">New password:</Label>
                                        </div>
                                        <TextInput id="newPassword" name="newPassword" type="password" />
                                    </div>
                                    <div className="form-item">
                                        <div className="block mb-2">
                                            <Label htmlFor="repeatNewPassword">Repeat new password:</Label>
                                        </div>
                                        <TextInput id="repeatNewPassword" name="repeatNewPassword" type="password" />
                                    </div>
                                </div>
                                <ul className="list-disc px-4 mt-2 text-gray-400 text-sm">
                                    <li>New password must be 8 or more characters</li>
                                    <li>New password must include a symbol (!,@,#,$,%,^,&,*,/,+,-,_)</li>
                                </ul>
                            </div>
                        </div>
                        <Button type="submit" color="red" disabled={submitting}>{submitting ? "Resetting..." : "Reset password"}</Button>
                    </form>
                    <HR />
                    <form onSubmit={handleDeleteSubmit}>
                        <div className="">
                            <h1 className="text-2xl font-bold ml-2 mb-2 text-red-600">Delete account</h1>
                            <div className="flex gap-4 mb-4 flex-col border border-red-600 p-4 rounded-2xl ">
                                <div className="flex gap-4 items-center flex-col sm:flex-row max-w-fit">
                                    <div className="form-item">
                                        <div className="block mb-2">
                                            <Label htmlFor="password">Password:</Label>
                                        </div>
                                        <TextInput id="password" name="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <HelperText className="text-red-600">Enter your password to confirm.</HelperText>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" color="red" disabled={submittingDelete}>{submittingDelete ? "Deleting..." : "DELETE"}</Button>
                    </form>
                </div>
            </div>
            {error && showError && (
                <div className="min-w-screen fixed flex top-0 left-0 p-4 z-10000">
					<Toast>
                        {error}
                        <ToastToggle onDismiss={() => setShowError(false)} />
                    </Toast>
				</div>
            )}
        </div>
    )
}