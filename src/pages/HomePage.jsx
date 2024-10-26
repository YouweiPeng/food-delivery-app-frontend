import { useState, useEffect, useRef } from "react";
import MealGrid from "../components/MealGrid";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import LoginModal from "../components/LoginModal";
import { useDispatch } from "react-redux";
import { setIsLoggin, setModalLogin, setUser } from "../store/interfaceSlice";
import MyInfoModal from "../components/MyInfoModal";
import { setModalMyInfo, setUserOrders} from "../store/interfaceSlice";
import MyOrdersModal from "../components/MyOrdersModal";
import { setModalMyOrders } from "../store/interfaceSlice";
const HomePage = () => {
    const [isButtonsVisible, setIsButtonsVisible] = useState(false);
    const [showUsernameButton, setShowUsernameButton] = useState(false);
    const isLoggin = useSelector((state) => state.interfaceSlice.isLoggin);
    const isMyinfoModal = useSelector((state) => state.interfaceSlice.modalMyInfo);
    const isMyOrdersModal = useSelector((state) => state.interfaceSlice.modalMyOrders);
    const buttonRef = useRef(null);
    const dispatch = useDispatch();
    const userData = useSelector((state)=> state.interfaceSlice.user)
    const isLoginModal = useSelector((state) => state.interfaceSlice.modalLogin);
    const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
    function encodeBase64Unicode(str) {
        const utf8Bytes = new TextEncoder().encode(str);
        return btoa(String.fromCharCode(...utf8Bytes));
      }
    const toggleButtons = () => {
        setIsButtonsVisible(!isButtonsVisible);
        setShowUsernameButton(!showUsernameButton);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsButtonsVisible(false);
                setShowUsernameButton(false);
            }
        };

        if (isButtonsVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isButtonsVisible]);
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
                toggleButtons();
                console.log("Logged out successfully");
            } else {
                console.error("Failed to log out");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    
    const handleMyOrders = () =>{
        dispatch(setModalMyOrders())
        toggleButtons()
        const get_order_for_user = async () => {
            const url = `${backend_origin}/order/get_order/${userData.uuid}`;
            const credentials = `${userData.username}:${userData.password}`;
            const encodedCredentials = encodeBase64Unicode(credentials);
            const response = await fetch(url,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }).then((data) => data.json())
            .then((data) => {
                console.log(data);
                dispatch(setUserOrders(data));
            }
        ).catch((err) => {
            console.log(err);
        });
            }
        get_order_for_user();
    }
    return (
        <div className="relative">
            <MealGrid />

            {!isLoggin ? (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded fixed bottom-4 right-4 z-50"
                onClick={() => dispatch(setModalLogin())}
                >
                    登录/注册
                </button>
            ) : (
                <div ref={buttonRef} className="relative">
                    <div
                        className={`fixed bottom-4 right-24 z-50 transition-all duration-500 transform ${
                            showUsernameButton ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                        }`}
                    >
                        <button className="bg-green-500 text-white p-4 rounded-full shadow-lg transition-transform duration-500 text-2xl">
                            {userData.username || "用户"}
                        </button>
                    </div>
                    <CgProfile
                        className="text-black bg-white p-2 rounded-full fixed bottom-4 right-4 z-50 cursor-pointer"
                        size={60}
                        onClick={toggleButtons}
                    />

                    <div
                        className={`fixed bottom-20 right-4 z-50 flex flex-col items-end transition-all duration-500 transform ${
                            isButtonsVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                        }`}
                        style={{
                            visibility: isButtonsVisible ? "visible" : "hidden",
                        }}
                    >
                        <button
                            className="bg-orange-400 text-white p-4 mb-3 transition-all duration-500 transform hover:scale-105 rounded-full text-2xl"
                            onClick={handleMyOrders}
                        >
                            我的订单
                        </button>
                        <button
                            className="bg-gray-800 text-white p-4 mb-3 transition-all duration-500 transform hover:scale-105 rounded-full text-2xl"
                            onClick={() => {dispatch(setModalMyInfo())
                            toggleButtons()
                            }}
                        >
                            我的信息
                        </button>
                        <button
                            className="bg-red-600 text-white p-4 transition-all duration-500 transform hover:scale-105 rounded-full text-2xl mb-3"
                            onClick={handleLogout}
                        >
                            登出
                        </button>
                    </div>
                </div>
            )}
            {isLoginModal &&<LoginModal />}
            {isMyinfoModal && <MyInfoModal/>}
            {isMyOrdersModal  &&  <MyOrdersModal/>}
        </div>
    );
};

export default HomePage;
