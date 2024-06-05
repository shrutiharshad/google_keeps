import { BrowserRouter, Routes, Route, RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import Homepage from "./Homepage";

const RoutesPage = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/Homepage" element={<Homepage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesPage;