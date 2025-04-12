import React from "react";
import "../CSS/MainPage/MainPage.css"; // 🔹 Se mantiene la consistencia con los estilos
import SearchBar from "./SearchBar";
import Sections from "./Sections";
import AlphabetIndex from "./AlphabetIndex";
import OpenAccessInfo from "./OpenAccessInfo";
import ResourceLinks from "./ResourceLinks";
import HeroSlider from "./HeroSlider";

const MainPage = () => {
  return (
    <div className="main-page">
      <SearchBar/>
      <HeroSlider/>
      <Sections/>
      <AlphabetIndex/>
      <OpenAccessInfo/>
      <ResourceLinks/>
    </div>
  );
};

export default MainPage;
