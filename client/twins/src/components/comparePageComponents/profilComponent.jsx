import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const ProfilComponent = ({ imageSrc, setImageSrc, predictions, setPredictions, isLeft }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const webcamRef = useRef(null);
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

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);

    };

    return (
        <div className="row d-flex justify-content-center" style={{ maxWidth: "40%" }}>
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-3 w-100 m-3">
                <div className="card w-100 shadow">
                    <div className="card-body p-4 w-100">
                        {isCameraActive ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                            />
                        ) : (
                            <div className="d-flex w-100">
                                <div className="flex-shrink-0" style={{ overflow: "hidden", width: "180px", height: "180px", borderRadius: "10px" }}>
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt="Captured"
                                            className="img-fluid"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", background: "#f0f0f0", borderRadius: "10px" }}>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow-1 ms-3">
                                    <h5 className="mb-1">{isLeft ? "Your Photo" : "Compare Photo"}</h5>
                                    <p className="mb-2 pb-1">Emotion: {predictions?.expression || "--"}</p>
                                    <div className="d-flex justify-content-start rounded-3 p-2 mb-2 bg-body-tertiary">
                                        <div>
                                            <p className="small text-muted mb-1">Age</p>
                                            <p className="mb-0">{predictions?.age || "--"}</p>
                                        </div>
                                        <div className="px-3">
                                            <p className="small text-muted mb-1">Gender</p>
                                            <p className="mb-0">{predictions?.gender || "--"}</p>
                                        </div>
                                        <div>
                                            <p className="small text-muted mb-1">Ethnicity</p>
                                            <p className="mb-0">{predictions?.ethnicity || "--"}</p>
                                        </div>
                                        <div>
                                            {!isLeft && <>
                                                <p className="small text-muted mb-1">Similarity</p>  
                                                <p className="mb-0">{predictions?.similarity_score.toFixed(2) || "--"}</p>
                                            </>}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="d-flex pt-1">
                            {!isCameraActive && (
                                <>
                                    <label
                                        htmlFor={`imageUpload${isLeft ? 'Left' : 'Right'}`}
                                        className="btn btn-outline-primary me-1 flex-grow-1"
                                        style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                                    >
                                        Upload Image
                                    </label>
                                    <input
                                        type="file"
                                        id={`imageUpload${isLeft ? 'Left' : 'Right'}`}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleUpload}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary me-1 flex-grow-1"
                                        style={{ whiteSpace: "nowrap" }}
                                        onClick={handleCapture}
                                    >
                                        Activate Camera
                                    </button>
                                </>
                            )}
                            {isCameraActive && (
                                <button
                                    type="button"
                                    className="btn btn-primary flex-grow-1"
                                    style={{ whiteSpace: "nowrap" }}
                                    onClick={handleCapture}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Capturing..." : "Capture"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilComponent;