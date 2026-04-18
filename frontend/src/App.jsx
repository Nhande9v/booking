import {BrowserRouter, Routes, Route} from "react-router-dom"
import Homepage from "./pages/HomePage"
import NotFound from "./pages/NotFound"
import Navbar from "./components/Navbar"
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
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App
