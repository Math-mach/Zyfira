import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import { LoginForm } from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Components
import { AppSidebar } from "./components/Sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import AssetsPage from "./pages/Assets";

const isAuthenticated = () => !!localStorage.getItem("isAuthenticated");

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated() ? (
          <Route
            path="*"
            element={
              <SidebarProvider>
                <div style={{ display: "flex" }}>
                  <AppSidebar />
                  <div style={{ flex: 1, padding: "20px" }}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/my-assets" element={<AssetsPage />} />
                      <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                      />
                    </Routes>
                  </div>
                </div>
              </SidebarProvider>
            }
          />
        ) : (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
