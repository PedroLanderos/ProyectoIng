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

function App() {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = auth.isAuthenticated;
  const isAdmin = auth?.user?.role === "Admin";

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* ✅ Redirigir a MainPage si el usuario está autenticado, sino mostrar LoginSignup */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/MainPage" /> : <LoginSignup />} />

        {/* ✅ Si intenta ir a Login manualmente estando autenticado, lo mandamos a MainPage */}
        <Route path="/login" element={!isAuthenticated ? <LoginSignup /> : <Navigate to="/MainPage" />} />

        {/* ✅ Redirigir a MainPage si no es Admin */}
        <Route path="/panelAdministrador" element={isAdmin ? <PanelDeAdministrador /> : <Navigate to="/MainPage" />} />

        {/* ✅ Ruta para agregar usuarios (accesible solo si es Admin) */}
        <Route path="/AddUser" element={isAdmin ? <AddUser /> : <Navigate to="/MainPage" />} />

        {/* ✅ Página Principal */}
        <Route path="/MainPage" element={<MainPage />} />

        <Route path="SearchArticle" element={<ArticleSearchPage/>}/>

        <Route path="UserProfile" element={<UserProfile/>}/>

        <Route path="ArticleDetail" element={<ArticleDetails/>}/>

        {/* ✅ Redirección de rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
