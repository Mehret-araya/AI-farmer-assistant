import { BrowserRouter, Routes, Route } from "react-router-dom";
import WeatherPage from "./pages/WeatherPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CropsPage from "./pages/CropsPage";
import useOfflineSync from "./hooks/useOfflineSync";
import AssistantPage from "./pages/AssistantPage";

function App() {
  useOfflineSync();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route
  path="/weather"
  element={
    <ProtectedRoute>
      <WeatherPage />
    </ProtectedRoute>
  }
/>
        <Route
  path="/crops"
  element={
    <ProtectedRoute>
      <CropsPage />
    </ProtectedRoute>
  }
/>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route 
  path="/assistant" 
  element={ 
    <ProtectedRoute> 
      <AssistantPage /> 
    </ProtectedRoute> 
  } 
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;