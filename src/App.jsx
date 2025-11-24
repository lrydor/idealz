import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Grid from "./components/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutLocal from "./pages/CheckoutLocal";
import Admin from "./pages/Admin";
import UpdatePassword from "./pages/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./pages/Orders";
import DisplayKitchen from "./pages/DisplayKitchen";
import DisplayQueue from "./pages/DisplayQueue";
import ChatWidget from "./components/ChatWidget";
import "./App.css";

function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase recovery links usan hash #access_token=...&type=recovery
    const params = new URLSearchParams(window.location.hash.replace("#", "?"));
    const type = params.get("type");

    if (type === "recovery") {
      navigate("/updatePassword");
    }
  }, [navigate]);

  return <AppRoutes />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu" element={<Grid />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkoutlocal" element={<CheckoutLocal />} />
      <Route path="/checkout/local" element={<CheckoutLocal />} />
      <Route
        path="/orders"
        element={
          <ProtectedRoute
            allowedRoles={["employee", "admin"]}
            element={<Orders />}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]} element={<Admin />} />
        }
      />
      <Route path="/updatePassword" element={<UpdatePassword />} />
      {/* <Route path="/display" element={<Display />} /> */}
      <Route
        path="/displaykitchen"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
            element={<DisplayKitchen />}
          />
        }
      />
      <Route
        path="/display/kitchen"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
            element={<DisplayKitchen />}
          />
        }
      />
      <Route
        path="/displayqueue"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
            element={<DisplayQueue />}
          />
        }
      />
      <Route
        path="/display/queue"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
            element={<DisplayQueue />}
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#ede7e3]">
      <Router>
        <AppWrapper />
      </Router>
      <ChatWidget />
    </div>
  );
}

export default App;
