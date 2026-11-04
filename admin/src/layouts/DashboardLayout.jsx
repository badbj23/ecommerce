import { Outlet } from "react-router"

function DashboardLayout({ children }) {
    return(
        <div>
            <h1>sidebar</h1>
            <h1>navbar</h1>
            <Outlet />
        </div>
    )
}

export default DashboardLayout;