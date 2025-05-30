import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages

import { LoginForm } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";

// Components

import { Sidebar } from "./components/Sidebar";

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
                                            path="/meus-ativos"
                                            element={<Profile />}
                                        />
                                        <Route
                                            path="/profile"
                                            element={<Profile />}
                                        />
                                        <Route
                                            path="/Historico"
                                            element={<Settings />}
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
