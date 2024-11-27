"use client";
import React, { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export const NavbarComponent = () => {
  const { userIsLoggedIn, setUserIsLoggedIn, user, setUser } = useContext(AppContext);
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');

  }

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    setUserIsLoggedIn(false);
    router.push('/login');
  }

  const handleHomePageClick = () => {
    router.push('/');
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-5 shadow-sm  mt-2 rounded mx-5">
      <div className="container-fluid d-flex justify-content-center align-items-center py-3">
        <a className="navbar-brand d-flex align-items-center mx-4" >
          <img src="logo.png" alt="Logo" style={{ width: '10%', height: '10%', borderRadius: '50%', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }} />
        </a>
        <ul className="navbar-nav mb-2 mb-lg-0 d-flex align-items-center">
          {!userIsLoggedIn ? (
            <>
              <li className="nav-item">
                <a className="navbar-brand d-flex align-items-center mx-4" onClick={handleHomePageClick} >
                  <i className="bi bi-person me-2"></i> Home
                </a>
              </li>
              <li className="nav-item">
                <a className="navbar-brand d-flex align-items-center mx-4" onClick={handleLoginClick}>
                  <i className="bi bi-person me-2"></i> Login
                </a>
              </li>
            </>

          ) : (
            <>
              <li className="nav-item">
                <a className="navbar-brand d-flex align-items-center mx-4" onClick={handleHomePageClick}  >
                  <i className="bi bi-person me-2"></i> Home
                </a>
              </li>
              <li className="nav-item">
                <a className="navbar-brand d-flex align-items-center mx-4" onClick={handleLogoutClick}>
                  <i className="bi bi-person me-2"></i> Logout
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
