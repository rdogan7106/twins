"use client"
export const footerComponent = () => {
    return (      
        <footer className="d-flex flex-column justify-content-center align-items-center py-3 border-top">
        <div className="d-flex flex-column align-items-center">
          <a
            href="/"
            className="mb-2 text-body-secondary text-decoration-none lh-1 text-center"
          >
            TWINS APP
          </a>
          <span className="text-danger"> Rahman & Veton </span>
        </div>
      </footer>
      
        
    );

}
export default footerComponent;