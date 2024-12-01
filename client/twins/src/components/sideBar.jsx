"use client";
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
const SideBar = ({ setCurrentView }) => {
    const { user } = useContext(AppContext);

    return (
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light min-vh-100 ">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2">
                <li className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline text-dark">Welcome</span>
                </li>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-ce nter align-items-sm-start" id="menu">
                    <li>
                        <button
                            className="nav-link px-0 align-middle"
                            onClick={() => setCurrentView("dashboard")}
                        >
                            <i className="fs-4"></i>
                            <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className="nav-link px-0 align-middle"
                            onClick={() => setCurrentView("compare")}
                        >
                            <i className="fs-4"></i>
                            <span className="ms-1 d-none d-sm-inline">Compare</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className="nav-link px-0 align-middle"
                            onClick={() => setCurrentView("profile")}
                        >
                            <i className="fs-4"></i>
                            <span className="ms-1 d-none d-sm-inline">Profile</span>
                        </button>
                    </li>
                </ul>
                <hr />
            </div>
        </div>
    );
};

export default SideBar;
