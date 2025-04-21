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
import BuyerBooks from "./components/pages/buyer/BuyerBooksPage/BuyerBooks";
import ProfilePage from "./components/pages/buyer/profile/ProfilePage";
import ChangePasswordPage from "./components/pages/buyer/profile/ChangePasswordPage";
import DashboardPage from "./components/pages/seller/Dashboard/DashboardPage";
import Footer from "./components/common/Footer";
import SellerNavBar from "./components/common/SellerNavBar";
import { MyBookPage } from "./components/pages/seller/MyBook/MyBookPage";
import { DiscountPage } from "./components/pages/seller/Discount/DiscountPage";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentRole = useSelector((state) => state.auth.user?.role[0]);

  // Check for token to maintain auth state
  if (localStorage.authToken) {
    // Set auth header
    setAuthToken(localStorage.authToken);

    // Decode token to get user data
    const decoded = jwtDecode(localStorage.authToken);

    // Set current user in Redux
    store.dispatch(setCurrentUser(decoded));

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
  }

  return (
    <Router>
      {currentRole == "seller" ? <SellerNavBar /> : <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerForm" element={<RegisterForm />} />
        <Route path="/bookDetail" element={<BookDetail />} />

        {currentRole == "seller" ? (
          <>
            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/dashboardPage" element={<DashboardPage />} />

              <Route path="/myBookPage" element={<MyBookPage />} />
              <Route path="/discountPage" element={<DiscountPage />} />
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
