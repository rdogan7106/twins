"use client"
import React from 'react'
import './heroComponent_css.css' 

const heroComponent = () => {
    return(
    <div className="container-fluid py-5">
    <div className="row align-items-center">
      <div className="col-md-6 px-5">
        <div className="animate-text">
          <span className="badge bg-primary mb-3 py-2 px-3">
            <i className="bi bi-gear"></i>A Social Media App
          </span>
          <h1 className="display-4 fw-bold text-dark">
            Maecenas Vitae Consectetur <br/>
            <span className="text-primary">Meet Us</span>
          </h1>
          <p className="text-muted">
            Find your new friends...
          </p>
          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-primary btn-lg">Get Started</button>
            <button className="btn btn-outline-primary btn-lg">
              <i className="bi bi-play-circle me-2"></i> Play Video
            </button>
          </div>
        </div>
      </div>
  
      <div className="col-md-6 text-center">
        <div className="animate-image">
          <img src="./image.png"  className="img-fluid .img-style" alt="Illustration"/>
        </div>
      </div>
    </div>
  </div>)
}
export default heroComponent
