"use client";
import { useState } from "react";
import SideBar from "../../components/SideBar";
import Compare from "../../app/dashboard-items/compare/page";
import Profile from "../../app/dashboard-items/profile/page";
import Dashboard from "../../app/dashboard-items/dashboard/dashboard";

const DashboardItems = () => {
    const [currentView, setCurrentView] = useState("dashboard");

    const renderContent = () => {
        switch (currentView) {
            case "dashboard":
                return  <Dashboard/>;
            case "compare":
                return <Compare/>;
            case "profile":
                return <Profile/>;
            default:
                return <Dashboard/>;
        }
    };

    return (
        <>
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <SideBar setCurrentView={setCurrentView} />
                <div className="col py-3">
                    {renderContent()}
                </div>
            </div>
        </div>
        </>
    );
};

export default DashboardItems;
