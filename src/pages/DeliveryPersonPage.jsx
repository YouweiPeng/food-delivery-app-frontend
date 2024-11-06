import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { setUser, setIsLoggin, setUserOrders } from "../store/interfaceSlice";
import { CgProfile } from "react-icons/cg";
import mapboxgl from "mapbox-gl";
import DeliveryPersonOrderFinishModal from "../components/DeliveryPersonOrderFinishModal";
import RouteModal from "../components/RouteModal";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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
    const [origin, setOrigin] = useState({ lat: 53.523423, lon: -113.622727 });
    const [closestOrder, setClosestOrder] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [flashingOrder, setFlashingOrder] = useState(null); // Track flashing order
    const orderRefs = useRef({}); // Ref for each order item

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setOrigin({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            });
        });
    }, []);

    useEffect(() => {
        const getOrders = async () => {
            const url = `${backend_origin}/order/delivery/`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                calculateAndSortOrders(data);
            } else {
                console.error("Failed to fetch orders for today");
            }
        };
        getOrders();
    }, [origin]);
        useEffect(() => {
            if (!closestOrder) return;

            const fetchRouteToClosestOrder = async () => {
                const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lon},${origin.lat};${closestOrder.lon},${closestOrder.lat}?geometries=polyline&access_token=${mapboxgl.accessToken}`;
                const response = await fetch(directionsUrl);
                const data = await response.json();
                if (response.ok && data.routes) {
                    setRouteData({
                        geometry: data.routes[0].geometry,
                        destination: closestOrder,
                    });
                } else {
                    console.error("Failed to fetch route:", data.message);
                }
            };

            fetchRouteToClosestOrder();
        }, [closestOrder, origin]);
    const calculateAndSortOrders = (ordersList) => {
        if (!origin) return;

        const originPoint = new mapboxgl.LngLat(origin.lon, origin.lat);
        const ordersWithDistance = ordersList.map((order) => {
            const distance = originPoint.distanceTo(new mapboxgl.LngLat(order.lon, order.lat));
            return { ...order, distance };
        });

        const sortedOrders = ordersWithDistance.sort((a, b) => a.distance - b.distance);
        setOrders(sortedOrders);
        setClosestOrder(sortedOrders[0]);
    };

    const handleOrderSelection = (event, selectedOrder) => {
        if (selectedOrder && orderRefs.current[selectedOrder.order_code]) {
            // Set the flashing order and scroll it into view
            setFlashingOrder(selectedOrder.order_code);
            orderRefs.current[selectedOrder.order_code].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            // Clear the Autocomplete input and flashing effect after selection
            setTimeout(() => setFlashingOrder(null), 1000); // 0.5s per flash * 2 flashes
        }
    };

    const handleFinishOrder = async (order) => {
        setIsOrderFinishModalOpen(true);
        setSelectedOrder(order);
    };

    const finishOrderAndRemove = (orderId) => {
        setOrders(orders.filter((order) => order.id !== orderId));
        calculateAndSortOrders(orders.filter((order) => order.id !== orderId));
    };

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
            } else {
                console.error("Failed to log out");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

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

    const openRouteModal = () => setIsRouteModalOpen(true);
    const closeRouteModal = () => setIsRouteModalOpen(false);

    return (
        <div className="mb-14">
            {isAuth ? (
                <div className="flex flex-col items-center">
                    <h2 className="font-semibold text-2xl text-center mt-4">三菜一汤配送员</h2>

                    <Autocomplete
                        id="combo-box"
                        className="mt-4 mb-4"
                        options={orders}
                        getOptionLabel={(option) => option.order_code}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="搜索订单" variant="outlined" />}
                        onChange={handleOrderSelection} // Handle the selection change
                    />

                    <button
                        className={`flex items-center text-black bg-white p-2 rounded-full fixed ${isOrderFinishModalOpen ? "hidden" : ""} bottom-4 left-4 z-50 cursor-pointer`}
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
                        <button className="text-black text-xl mb-6 block" onClick={toggleSidebar} id="sidebar-close-button">✕</button>
                        <button
                            className="bg-blue-600 text-white p-4 w-full text-left transition-transform duration-500 hover:scale-105 rounded text-2xl"
                            onClick={openRouteModal}
                        >
                            查看分布图
                        </button>
                        <button
                            className="bg-red-600 text-white p-4 w-full text-left transition-transform duration-500 hover:scale-105 rounded text-2xl mt-5"
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
                                    <div
                                        key={order.order_code}
                                        className={`p-4 border rounded ${
                                            order.id === closestOrder?.id ? "border-8 border-red-600" : "border-gray-300 border-4"
                                        } ${flashingOrder === order.order_code ? "flash-border" : ""}`}
                                        ref={(el) => (orderRefs.current[order.order_code] = el)}
                                    >
                                        <p><strong>订单号:</strong> {order.order_code}</p>
                                        <p><strong>地址:</strong> {order.address}</p>
                                        <p><strong>电话号码:</strong> {order.phone_number}</p>
                                        <p><strong>邮箱:</strong> {order.email}</p>
                                        <p><strong>价格:</strong> ${order.price}</p>
                                        <p><strong>份数:</strong> {order.quantity}</p>
                                        <p><strong>房间号:</strong> {order.room_number || "客户未填"}</p>
                                        <button onClick={() => handleFinishOrder(order)}>完成订单</button>
                                    </div>
                                ))}
                                {isOrderFinishModalOpen && (
                                    <DeliveryPersonOrderFinishModal
                                        order={selectedOrder}
                                        closeFinishModal={() => setIsOrderFinishModalOpen(false)}
                                        finishOrderCallback={() => finishOrderAndRemove(selectedOrder.id)}
                                    />
                                )}
                                {isRouteModalOpen && routeData && (
                                    <RouteModal
                                        orders={orders}
                                        origin={origin}
                                        routeData={routeData}
                                        onClose={closeRouteModal}
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
