"use client";
import React, { useState, useRef, useContext, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { useRouter } from 'next/navigation';


const ProfilePage = () => {
    const router = useRouter(); 
    const { user, setUser } = useContext(AppContext);
    const [currentUser, setCurrentUser] = useState(user);
    useEffect(() => {
        setImageSrc(currentUser?.self_image || null);
        setCurrentUser(user);
    }, [user]);
    console.log(currentUser);

    const [imageSrc, setImageSrc] = useState(currentUser?.self_image || null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const webcamRef = useRef(null);
    const [updatePasswordClicked, setUpdatePasswordClicked] = useState(false);
    const [current_password, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");

    const handleCapture = async () => {
        if (!isCameraActive) {
            setIsCameraActive(true);
            return;
        }
        setIsLoading(true);
        const capturedImageSrc = webcamRef.current.getScreenshot();
        setImageSrc(capturedImageSrc);
        setIsCameraActive(false);
        setIsLoading(false);
    };

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveImage = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:5000/user/update-user",
                { self_image: imageSrc },
                { headers: { Authorization: token } }
            );
            alert("Profile image updated successfully!");
            setCurrentUser(response.data.user);
            setUser(response.data.user);
            console.log(response);
        } catch (error) {
            console.error("Error updating profile image:", error);
            alert("Failed to update profile image.");
        }
    };
    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:5000/user/update-user",
                { password: password,current_password:current_password },
                { headers: { Authorization: token } }
            );
            alert("Password updated successfully!");
            setCurrentUser(response.data.user);
            setUser(response.data);
            setUpdatePasswordClicked(false);
            setCurrentPassword("");
            setPassword("");
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password.");
        }
    };
    const deleteAccount = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                "http://localhost:5000/delete-user",
                { headers: { Authorization: token } }
            );
            router.push('/register');
            alert("Account deleted successfully!");
            localStorage.removeItem("token");
            setUser(null);
            setCurrentUser(null);
            
            
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account.");
        }
    } 

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <div className="row">
                   
                    <div className="col-md-4 d-flex flex-column align-items-center">
                        <div style={{ position: "relative" }}>
                            
                            {isCameraActive ? (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="rounded-circle mb-3"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                />
                            ) : (
                                <img
                                    src={imageSrc || "https://via.placeholder.com/150"}
                                    alt="Profile"
                                    className="rounded-circle mb-3"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                />
                            )}
                        </div>
                       
                        <div className="d-flex justify-content-center gap-2">
                            {!isCameraActive ? (
                                <>
                                    <label htmlFor="imageUpload" className="btn btn-primary">
                                        Upload
                                    </label>
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleUpload}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleCapture}
                                    >
                                        Capture
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn btn-success"
                                    onClick={handleCapture}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Capturing..." : "Capture"}
                                </button>
                            )}
                        </div>
                        <button
                            className="btn btn-success mt-3"
                            onClick={handleSaveImage}
                            disabled={!imageSrc}
                        >
                            Save Profile Image
                        </button>
                    </div>

                    <div className="col-md-8">
                        <h4>User Information</h4>
                        <hr />
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                defaultValue={currentUser?.username || "JohnDoe"}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                defaultValue={currentUser?.email || "john.doe@example.com"}
                                disabled
                            />
                        </div>
                        <></>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            {!updatePasswordClicked ? (
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value="********"
                                    disabled
                                />
                            ) : (
                                <form onSubmit={handleUpdatePassword}>
                                    <div className="form-outline mb-4">
                                        <input
                                            type="password"
                                            id="current_password"
                                            className="form-control"
                                            value={current_password}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="current_password">Current Password</label>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="password">New Password</label>
                                    </div>

                                    <button className="btn btn-success m-2" type="submit">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger m-2"
                                        onClick={() => setUpdatePasswordClicked(false)}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>

                        {!updatePasswordClicked && (
                            <button
                                className="btn btn-success m-2"
                                onClick={() => setUpdatePasswordClicked(true)}
                            >
                                Update Your Password
                            </button>
                        )}

                        <button className="btn btn-danger m-2" onClick={() => deleteAccount()}>Delete Your Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
