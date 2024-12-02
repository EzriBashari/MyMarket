import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./pages/header/header";
import Footer from "./pages/footer/footer";
import Login from "./pages/loginAndRegister/login/login";
import Register from "./pages/loginAndRegister/register/register";
import Cart from "./pages/cart/cart";
import Profile from "./pages/profile/profile";
import HomePage from "./pages/home page/homePage";

import UpdateProduct from "./pages/profile/product/updateProduct";
import AddCategory from "./pages/profile/category/AddCategory.js";
import Seller from "./pages/seller/seller";
//import EditProfile from "./pages/profile/editProfile";
import userContext from "./context/userContext";
import Admin from "./pages/admin/admin";
import { useState } from "react";
import styles from "./App.module.css";
import Store from "./pages/home page/store/stor";
import BuyerOrders from "./pages/profile/my orders/buyerOrders";

function App() {
  const [user, setUser] = useState({
    userID: "1",
    isAdmin: 0,
    role: "no user",
  });

  return (
    <div className={`${styles.container}`}>
      <userContext.Provider value={{ user, setUser }}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/seller" element={<Seller />} />
            <Route path="/store" element={<Store />} />
            <Route path="/orders" element={<BuyerOrders />} />

            <Route
              path="/updateProduct/:productNumber"
              element={<UpdateProduct />}
            />

            <Route path="/addCategory" element={<AddCategory />} />
          </Routes>
          <Footer />
        </Router>
      </userContext.Provider>
    </div>
  );
}
export default App;
