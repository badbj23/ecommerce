import {SignedIn, SignInButton, SignedOut, UserButton, useAuth} from "@clerk/clerk-react";
import {Navigate, Routes, Route} from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Customers from "./pages/Customers.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import {LoaderIcon} from "lucide-react";
import Loader from "./components/Loader.jsx";



function App() {

    const {isSignedIn, isLoaded} = useAuth()

    if(!isLoaded) return <Loader />

    return(
        <Routes>
            <Route path="/login" element={isSignedIn ? <Navigate to={"/dashboard"} /> : <LoginPage />} />

            <Route path="/" element={isSignedIn ? <DashboardLayout /> : <Navigate to={"/login"} />} >
                <Route index element={<Navigate to={"/dashboard"} />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="custys" element={<Customers />} />


            </Route>

        </Routes>

    )
}
export default App

