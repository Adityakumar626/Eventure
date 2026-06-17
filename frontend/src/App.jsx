import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import EventDetail from "./pages/EventDetail";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import UserDashboard from "./pages/UserDashboard"

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="grow container mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="*"
                element={
                  <h1 className="text-3xl font-bold text-center mt-20">
                    404 - Page Not Found
                  </h1>
                }
              />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
