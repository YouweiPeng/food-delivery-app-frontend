import { useState, useEffect, useRef } from "react";
import MealGrid from "../components/MealGrid";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import LoginModal from "../components/LoginModal";
import MyInfoModal from "../components/MyInfoModal";
import MyOrdersModal from "../components/MyOrdersModal";
import { setIsLoggin, setModalLogin, setUser, setModalMyInfo, setUserOrders, setModalMyOrders } from "../store/interfaceSlice";

const HomePage = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const isLoggin = useSelector((state) => state.interfaceSlice.isLoggin);
    const isMyinfoModal = useSelector((state) => state.interfaceSlice.modalMyInfo);
    const isMyOrdersModal = useSelector((state) => state.interfaceSlice.modalMyOrders);
    const isLoginModal = useSelector((state) => state.interfaceSlice.modalLogin);
    const userData = useSelector((state) => state.interfaceSlice.user);
    const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
    const dispatch = useDispatch();
    const sideBarRef = useRef(null);
    function encodeBase64Unicode(str) {
        const utf8Bytes = new TextEncoder().encode(str);
        return btoa(String.fromCharCode(...utf8Bytes));
    }

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
                setIsSidebarVisible(false);
            }
        }
        if (isSidebarVisible){
            document.addEventListener("mousedown", handleOutsideClick);
        }
        else{
            document.removeEventListener("mousedown", handleOutsideClick);
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }
    , [sideBarRef]);
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

    const handleMyOrders = () => {
        dispatch(setModalMyOrders());
        toggleSidebar();
        const get_order_for_user = async () => {
            const url = `${backend_origin}/order/get_order/${userData.uuid}`;
            const credentials = `${userData.username}:${userData.password}`;
            const encodedCredentials = encodeBase64Unicode(credentials);
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                const data = await response.json();
                dispatch(setUserOrders(data));
            } catch (err) {
                console.error(err);
            }
        };
        get_order_for_user();
    };

    return (
        <div className="relative">
            <MealGrid />

            {!isLoggin ? (
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded fixed bottom-4 right-4 z-50"
                    onClick={() => dispatch(setModalLogin())}
                >
                    登录/注册
                </button>
            ) : (
                <>
                    <CgProfile
                        className="text-black bg-white p-2 rounded-full fixed bottom-4 left-4 z-50 cursor-pointer"
                        size={60}
                        onClick={toggleSidebar}
                    />

                    <div
                        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-500 bg-gray-800 p-6 flex flex-col items-end ${
                            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
                            
                        }`}
                        ref={sideBarRef}
                    >
                        <button
                            className="text-black text-xl mb-6 block"
                            onClick={() => toggleSidebar()}
                            id = "sidebar-close-button"
                        >
                            ✕
                        </button>
                        <button
                            className="bg-orange-400 text-white p-4 mb-4 w-full text-left transition-transform duration-500 hover:scale-105 rounded text-2xl"
                            onClick={handleMyOrders}
                        >
                            我的订单
                        </button>
                        <button
                            className="bg-lime-600 text-white p-4 mb-4 w-full text-left transition-transform duration-500 hover:scale-105 rounded text-2xl"
                            onClick={() => {
                                dispatch(setModalMyInfo());
                                toggleSidebar();
                            }}
                        >
                            我的信息
                        </button>
                        <button
                            className="bg-red-600 text-white p-4 w-full text-left transition-transform duration-500 hover:scale-105 rounded text-2xl"
                            onClick={handleLogout}
                        >
                            登出
                        </button>
                    </div>
                </>
            )}

            {isLoginModal && <LoginModal />}
            {isMyinfoModal && <MyInfoModal />}
            {isMyOrdersModal && <MyOrdersModal />}
        </div>
    );
};

export default HomePage;
