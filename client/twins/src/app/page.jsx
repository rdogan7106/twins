"use client";
import { AppContext } from "../context/AppContext";
import React from "react";
import { useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import HeroComponent from "../components/homePageComponents/heroComponent/heroComponent";
import StatistisSection from "../components/homePageComponents/statisticsComponents/statiscticsSection";
import TryToCompareComponent from "../components/homePageComponents/tryToCompareComponent/tryToCompareComponent";
import Testimonials from "../components/homePageComponents/testimonalComponents/testimonalComponent";
import ContactComponet  from "../components/homePageComponents/contactComponent/contactComponent";
export default function Home() {
  const { userIsLoggedIn, setUserIsLoggedIn } = useContext(AppContext);

  return (
    <AppContext.Provider  value={{ userIsLoggedIn, setUserIsLoggedIn }} >
      <div className="p-5 pb-0" >            
        <HeroComponent />  
        <StatistisSection/>
        <TryToCompareComponent/>
        <Testimonials/> 
        <ContactComponet/>
      </div>
    </AppContext.Provider>
  );
}
