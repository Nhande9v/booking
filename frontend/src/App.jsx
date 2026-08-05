import {BrowserRouter, Routes, Route} from "react-router-dom"
import Homepage from "./pages/HomePage"
import NotFound from "./pages/NotFound"
import Navbar from "./components/home/Navbar"
import SearchPage from "./pages/SearchPage";
import HotelDetail from "./pages/HotelDetail";
import RoomPage from "./pages/RoomPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContextProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccountSettings from "./pages/AccountSettings";
import BecomeAHost from "./pages/BecomeAHost";
import CreateHotel from "./pages/CreateHotel";
import HostDashboard from "./pages/HostDashboard";
import HostHotelRooms from "./pages/HostHotelRooms";
import AdminHotelReview from "./pages/AdminHotelReview";
import RoleRoute from "./components/auth/RoleRoute";

function App() {
  return (
    <AuthContextProvider> 
      <BrowserRouter> 
                <Toaster position="bottom-right" richColors />
        <Navbar />
        <div className="pt-18">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/hotel/:id" element={<HotelDetail/>}/>
            <Route path="/room/:roomId" element={<RoomPage/>}/>
            <Route path="*" element={<NotFound />} />
            <Route path="/become-a-host" element={<BecomeAHost />} />
            <Route path="/create-hotel" element={<RoleRoute roles={["provider", "admin"]}><CreateHotel /></RoleRoute>} />
            <Route path="/host/dashboard" element={<RoleRoute roles={["provider", "admin"]}><HostDashboard /></RoleRoute>} />
            <Route path="/host/hotels/:hotelId/rooms" element={<RoleRoute roles={["provider", "admin"]}><HostHotelRooms /></RoleRoute>} />
            <Route path="/admin/hotels/review" element={<RoleRoute roles={["admin"]}><AdminHotelReview /></RoleRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App
