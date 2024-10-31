import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { setUser, setIsLoggin, setUserOrders } from "../store/interfaceSlice";
import { CgProfile } from "react-icons/cg";
import { set } from "date-fns";
import DeliveryPersonOrderFinishModal from "../components/DeliveryPersonOrderFinishModal";
const DeliveryPersonPage = () => {
    const user = useSelector((state) => state.interfaceSlice.user);
    const isAuth = useSelector((state) => state.interfaceSlice.user.is_staff);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
    const [selectedOrder, setSelectedOrder] = useState(null);
    const dispatch = useDispatch();
    const sideBarRef = useRef(null);
    const [isOrderFinishModalOpen, setIsOrderFinishModalOpen] = useState(false);
    useEffect(() => {
        const get_all_orders_for_today = async () => {
            const url = `${backend_origin}/order/delivery/`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data); // Set fetched orders to state
                console.log(data);
            } else {
                console.error("Failed to fetch orders for today");
            }
        };
        get_all_orders_for_today();
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
                setIsSidebarVisible(false);
            }
        };
        if (isSidebarVisible) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isSidebarVisible]);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${backend_origin}/user/logout/`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                dispatch(setUser({}));
                dispatch(setIsLoggin(false));
                dispatch(setUserOrders([]));
                toggleSidebar();
                console.log("Logged out successfully");
            } else {
                console.error("Failed to log out");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    const handleFinishOrder = async (order) => {
        console.log("Order finished:", order);
        setIsOrderFinishModalOpen(true);
        setSelectedOrder(order);
    };
    const finishOrderAndRemove = (orderId) => {
        const updatedOrders = orders.filter((order) => order.id !== orderId);
        setOrders(updatedOrders);
    };
    return (
        <div>
            {isAuth ? (
                <div>
                    <h2
                    className="font-semibold text-2xl text-center mt-4"
                    >三菜一汤配送员</h2>
                    <button
                        className={`flex items-center text-black bg-white p-2 rounded-full fixed ${isOrderFinishModalOpen?"hidden":""} bottom-4 left-4 z-50 cursor-pointer`}
                        onClick={toggleSidebar}
                    >
                        <CgProfile size={40} />
                        <span className="ml-2 font-medium">欢迎配送员</span>
                    </button>

                    <div
                        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-500 bg-gray-800 p-6 flex flex-col items-end ${
                            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
                        }`}
                        ref={sideBarRef}
                    >
                        <button
                            className="text-black text-xl mb-6 block"
                            onClick={toggleSidebar}
                            id="sidebar-close-button"
                        >
                            ✕
                        </button>
                        <button
                            className="bg-red-600 text-white p-4 w-full text-left transition-transform duration-500 hover:scale-105 rounded text-2xl"
                            onClick={handleLogout}
                        >
                            登出
                        </button>
                    </div>

                    {/* Orders Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">今日订单 总数：{orders.length}</h2>
                        {orders.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {orders.map((order) => (
                                    <div key={order.order_code} className="p-4 border border-gray-300 rounded">
                                        <p><strong>订单号:</strong> {order.order_code}</p>
                                        <p><strong>地址:</strong> {order.address}</p>
                                        <p><strong>电话号码:</strong> {order.phone_number}</p>
                                        <p><strong>邮箱:</strong> {order.email}</p>
                                        <p><strong>价格:</strong> ${order.price}</p>
                                        <p><strong>份数:</strong> {order.quantity}</p>
                                        <p><strong>房间号: </strong>  
                                            {order.room_number ? order.room_number : "客户未填"}</p>
                                        <button
                                        onClick={() =>{
                                            handleFinishOrder(order);
                                        }}
                                        >完成订单</button>
                                    </div>
                                ))}
                                {isOrderFinishModalOpen && (
                                        <DeliveryPersonOrderFinishModal
                                            order={selectedOrder}
                                            closeFinishModal={() => setIsOrderFinishModalOpen(false)}
                                            finishOrderCallback={() => finishOrderAndRemove(selectedOrder.id)}
                                                    />
                                                )}
                            </div>
                        ) : (
                            <p className="mt-4 text-gray-500">No orders for today.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Unauthorized Access</h1>
                </div>
            )}
        </div>
    );
};

export default DeliveryPersonPage;
