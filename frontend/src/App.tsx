import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import { LoginForm } from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Components
import { Sidebar } from "./components/Sidebar";
import AssetsPage from "./pages/Assets";

const isAuthenticated = () => !!localStorage.getItem("token");

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {isAuthenticated() ? (
                    <Route
                        path="*"
                        element={
                            <div style={{ display: "flex" }}>
                                <Sidebar />
                                <div style={{ flex: 1, padding: "20px" }}>
                                    <Routes>
                                        <Route
                                            path="/dashboard"
                                            element={<Dashboard />}
                                        />
                                        <Route
                                            path="/my-assets"
                                            element={<AssetsPage />}
                                        />
                                        <Route
                                            path="*"
                                            element={
                                                <Navigate
                                                    to="/dashboard"
                                                    replace
                                                />
                                            }
                                        />
                                    </Routes>
                                </div>
                            </div>
                        }
                    />
                ) : (
                    <>
                        <Route path="/login" element={<LoginForm />} />
                        <Route
                            path="*"
                            element={<Navigate to="/login" replace />}
                        />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
