import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages

import { LoginForm } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";

// Components

import { Sidebar } from "./components/Sidebar";

const isAuthenticated = () => !!localStorage.getItem("token");

console.log(isAuthenticated());

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
                                            path="*"
                                            element={<Dashboard />}
                                        />
                                        <Route
                                            path="/profile"
                                            element={<Profile />}
                                        />
                                        <Route
                                            path="/settings"
                                            element={<Settings />}
                                        />
                                    </Routes>
                                </div>
                            </div>
                        }
                    />
                ) : (
                    <Route path="*" element={<LoginForm />} />
                )}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
