
import { useQuery } from "@tanstack/react-query";
import { OrderApi, statsApi } from "../lib/api.js";
import {
    DollarSignIcon,
    PackageIcon,
    ShoppingBagIcon,
    UsersIcon,
} from "lucide-react";
import {capitalizeText, formatDate, getOrderStatusBade} from "../lib/utils.js";

function Dashboard() {
    const {
        data: ordersData,
        isLoading: orderLoading,
        isError: orderError,
    } = useQuery({
        queryKey: ["orders"],
        queryFn: OrderApi.getAll,
    });

    const {
        data: statsData,
        isLoading: statsLoading,
        isError: statsError,
    } = useQuery({
        queryKey: ["dashboardStats"],
        queryFn: statsApi.getDashboard,
    });

    // Safely handle API responses
    const recentOrders = ordersData?.orders?.slice(0, 5) || [];

    const statCards = [
        {
            name: "Total Revenue",
            value: statsLoading
                ? "..."
                : `$${Number(statsData?.totalRevenue ?? 0).toFixed(2)}`,
            icon: <DollarSignIcon className="w-8 h-8" />,
        },
        {
            name: "Total Orders",
            value: statsLoading ? "..." : statsData?.totalOrders ?? 0,
            icon: <ShoppingBagIcon className="w-8 h-8" />,
        },
        {
            name: "Total Customers",
            value: statsLoading ? "..." : statsData?.totalCustos ?? 0,
            icon: <UsersIcon className="w-8 h-8" />,
        },
        {
            name: "Total Products",
            value: statsLoading ? "..." : statsData?.totalProducts ?? 0,
            icon: <PackageIcon className="w-8 h-8" />,
        },
    ];

    return (
        <div className="space-y-6">

            {statsError && (
                <p className="text-error">
                    Failed to load dashboard statistics.
                </p>
            )}

            <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
                {statCards.map((stat) => (
                    <div key={stat.name} className="stat">
                        <div className="stat-figure text-primary">
                            {stat.icon}
                        </div>

                        <div className="stat-title">
                            {stat.name}
                        </div>

                        <div className="stat-value">
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title">Recent Orders</h2>

                    {orderLoading ? (
                        <p>Loading recent orders...</p>
                    ) : orderError ? (
                        <p className="text-error">
                            Failed to load recent orders.
                        </p>
                    ) : recentOrders.length === 0 ? (
                        <p>No recent orders found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                                </thead>

                                <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            {order._id}
                                        </td>
                                        <td>
                                            {order.user?.name || "Customer"}
                                        </td>
                                        <td>
                                            ${Number(order.totalAmount ?? 0).toFixed(2)}
                                        </td>
                                        <td>
                                            {order.status || "Pending"}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Recent Orders</h2>
                    {orderLoading ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-base-content/60">
                            No recent orders found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Order Id</th>
                                    <th>Custy</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="font-medium">{order.shippingAddress.fullName}</div>
                                                <div className="text-sm opacity-60">
                                                    {order.orderItems.length} item(s)
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                {order.orderItems[0]?.name}
                                                {order.orderItems.length > 1 && `+${order.orderItems.length - 1 } more`}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
                                        </td>
                                        <td>
                                            <div className={`badge ${getOrderStatusBade(order.status)}`}>
                                                {capitalizeText(order.status)}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
