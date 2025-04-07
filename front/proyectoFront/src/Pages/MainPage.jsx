import React from "react";
import "./CSS/MainPage.css"; // 🔹 Se mantiene la consistencia con los estilos
import SearchBar from "./SearchBar";
import Sections from "./Sections";
import AlphabetIndex from "./AlphabetIndex";

const MainPage = () => {
  return (
    <div className="main-page">
      <SearchBar/>
      <Sections/>
      <AlphabetIndex/>
    </div>
  );
};

export default MainPage;
