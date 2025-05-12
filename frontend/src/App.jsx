import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Login from "./components/auth/Login";
import RegisterForm from "./components/auth/RegisterForm";
import HomePage from "./components/pages/buyer/HomePage/HomePage";
import NavBar from "./components/common/NavBar";
import BookDetail from "./components/pages/buyer/BookDetail/BookDetail";
import PrivateRoute from "./components/common/PrivateRoute";
import setAuthToken from "./utils/setAuthToken";
import { jwtDecode } from "jwt-decode";
import { setCurrentUser, logout } from "./redux/authSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import BuyerBooks from "./components/pages/buyer/BuyerBooksPage/BuyerBooks";
import ProfilePage from "./components/pages/buyer/profile/ProfilePage";
import ChangePasswordPage from "./components/pages/buyer/profile/ChangePasswordPage";
import DashboardPage from "./components/pages/seller/Dashboard/DashboardPage";
import Footer from "./components/common/Footer";
import SellerNavBar from "./components/common/SellerNavBar";
import { MyBookPage } from "./components/pages/seller/MyBook/MyBookPage";
import { DiscountPage } from "./components/pages/seller/Discount/DiscountPage";
import FreeBooksPage from "./components/pages/buyer/BookPages/FreeBooksPage";
import GenreBooksPage from "./components/pages/buyer/BookPages/GenreBooksPage";
import SearchResultsPage from "./components/pages/buyer/BookPages/SearchResultsPage";
import CommonToast from "./components/common/CommonToast";
import TopRatedPage from "./components/pages/buyer/BookPages/TopRatedPage";

if (localStorage.authToken) {
  setAuthToken(localStorage.authToken);
  const decoded = jwtDecode(localStorage.authToken);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logout());
    window.location.href = "/login";
  }
}

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentRole = useSelector((state) => state.auth.user?.role[0]);

  return (
    <Router>
      <CommonToast />

      {currentRole == "seller" && <SellerNavBar />}
      {currentRole !== "seller" && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerForm" element={<RegisterForm />} />
        <Route path="/bookDetail/:bookID" element={<BookDetail />} />

        {currentRole == "seller" ? (
          <>
            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/dashboardPage" element={<DashboardPage />} />

              <Route path="/myBookPage" element={<MyBookPage />} />
              <Route path="/discountPage" element={<DiscountPage />} />

              <Route path="/profilePage" element={<ProfilePage />} />

              <Route path="/changePassword" element={<ChangePasswordPage />} />
            </Route>
          </>
        ) : (
          <>
            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/profilePage" element={<ProfilePage />} />

              <Route path="/changePassword" element={<ChangePasswordPage />} />

              <Route path="/buyerBooks" element={<BuyerBooks />} />
            </Route>
          </>
        )}

        {currentRole !== "seller" && (
          <>
            <Route path="/freeBooksPage" element={<FreeBooksPage />} />
            <Route
              path="/genreBooksPage/:genreSlug"
              element={<GenreBooksPage />}
            />

            <Route path="/search" element={<SearchResultsPage />} />

            <Route path="/topRatedPage" element={<TopRatedPage />} />
          </>
        )}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
