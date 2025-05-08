import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./Pages/LoginSignup";
import PanelDeAdministrador from "./Pages/PanelDeAdministrador";
import AddUser from "./Pages/AddUser";
import MainPage from "./Pages/MainPage/MainPage"; 
import { AuthContext } from "./Context/AuthContext";
import Navbar from './Components/Navbar/Navbar';
import Footer from "./Components/Footer/Footer";
import ArticleSearchPage from "./Pages/ArticleSearchPage";
import UserProfile from "./Pages/UserProfile";
import ArticleDetails from "./Pages/ArticleDetails";
import UserHistory from "./Pages/UserHistory";
import AboutUs from "./Pages/AboutUs"

function App() {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = auth.isAuthenticated;
  const isAdmin = auth?.user?.role === "Admin";

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginSignup /> : <Navigate to="/MainPage" />} />
        <Route path="/panelAdministrador" element={isAdmin ? <PanelDeAdministrador /> : <Navigate to="/MainPage" />} />
        <Route path="/AddUser" element={isAdmin ? <AddUser /> : <Navigate to="/MainPage" />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/SearchArticle" element={<ArticleSearchPage />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/ArticleDetail/:id" element={<ArticleDetails />} />
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/UserHistory/:id" element={<UserHistory />} />
        <Route path="/AboutUs" element={<AboutUs />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
