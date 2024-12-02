"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import "./tryToCompareComponent_css.css"
import Webcam from "react-webcam";
import Face3DViewer from './Face3DViewer';


const tryToCompareComponent = () => {
    const webcamRef = useRef(null);
    const [webcamActive, setWebcamActive] = useState(false);
    const [smallImageSrc, setSmallImageSrc] = useState("/image.png");
    const [largeImageSrc, setLargeImageSrc] = useState("/image.png");
    const [analysisResult, setAnalysisResult] = useState(null);


    const handleTryClick = () => {
        setWebcamActive(true);
    };

    const handleCapture = async () => {
        if (!webcamRef.current) return;
        const capturedImage = webcamRef.current.getScreenshot();
        if (!capturedImage) {
            console.error("Failed to capture image");
            return;
        }
    
        setWebcamActive(false);
    
        try {
            const response = await fetch('http://localhost:5000/analyze_face', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: capturedImage }),
            });
    
            if (response.ok) {
                const result = await response.json();
                setAnalysisResult(result); 
                setSmallImageSrc(result.original_image);
                setLargeImageSrc(result.face_3d);
                console.log("Analysis Result:", result);
            } else {
                const errorResult = await response.json();
                console.error("Error:", errorResult.message);
            }
        } catch (error) {
            console.error("Error while sending image to the server:", error);
        }
    };
    return (
        <div className="info-component container-fluid py-5">
            <div className="row align-items-center">
            
                <div className="col-md-6 text-center">
                    {webcamActive ? ( 
                        <div className="image-container h-50">
                        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-100 rounded shadow" />
                        <button className="btn btn-success mt-3" onClick={handleCapture}>
                            Capture
                        </button>
                    </div>

                    ) : ( <div className="image-container position-relative">
                        <div className="large-image">
                            <img
                                src={smallImageSrc}
                                alt="Large"
                                className="img-fluid rounded shadow"
                            />
                            <div className="small-image">
                                <img
                                    src={largeImageSrc}
                                    alt="Small"
                                    className="img-fluid"
                                />
                            </div>
                            
                        </div>
                        {analysisResult && (
                             <div className="overlay"> 
                             <span className="text-primary">Predicted  &nbsp; </span>
                             <span className="text-primary">Age: {analysisResult?.predictions.age}  &nbsp;</span>
                             <span className="text-primary">Gender :  {analysisResult?.predictions.gender}   &nbsp;</span>
                             <span className="text-primary">Expression : {analysisResult?.predictions.expression}  &nbsp;</span>
                             <span className="text-primary">Etnicity :{analysisResult?.predictions.ethnicity}</span>
                         </div>
                        )}
                       
                        <button className="btn btn-primary try-button mt-3" onClick={handleTryClick}>
                            Try
                        </button>
                    </div>)}

                </div>
                <div className="col-md-6 px-5">
                    <h6 className="text-primary mb-3">MORE ABOUT US</h6>
                    <h2 className="fw-bold">Twins is a new social network</h2>
                    <p className="text-muted">
                    The aim is to enable people who are similar to each other to meet and become friends.
                    Twins app performs facial analysis with artificial intelligence and calculates similarity rates.
                    </p>
                    <ul className="list-unstyled text-primary">
                        <li>✔️ Register yourself</li>
                        <li>✔️ Save your photo</li>
                        <li>✔️ Compare yourself</li>
                        <li>✔️ See the results</li>
                        <li>✔️ Send friend request</li>
                        <li>✔️ Meet your friends</li>
                    </ul>
                    <div className="author-info mt-4">
                        <p>
                            <strong>Rahman Dogan & Veton Shala</strong> <br />
                            <span className="text-muted">CEO & Founder</span>
                        </p>
                        <p>
                            📞 Call us anytime: <strong>+123 456-789</strong>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default tryToCompareComponent;