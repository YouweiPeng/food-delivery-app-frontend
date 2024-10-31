import { useSelector, useDispatch } from "react-redux";
import { setModalMyInfo } from "../store/interfaceSlice"; // Assuming you have this action to close the modal
import { useState } from "react";
import { setUser } from "../store/interfaceSlice";
import { set } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { useRef, useEffect } from "react";
const MyInfoModal = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.interfaceSlice.user);
    const [isEditing, setIsEditing] = useState(false);
    const [tempoAddress, setTempoAddress] = useState(useSelector((state) => state.interfaceSlice.user.address));
    const [editedUser, setEditedUser] = useState(user);
    const [suggestions, setSuggestions] = useState([]); // Store suggestions from Mapbox
    const [loading, setLoading] = useState(false); // Loading state
    const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
    const [sessionToken] = useState(uuidv4());
    const addressInputRef = useRef(null); // Ref for the address input
    const suggestionBoxRef = useRef(null); // Ref for the suggestion box
      const handleInputChange = (e) => {
        if(e.target.name === "address"){
        const { name, value } = e.target;
        setTempoAddress(value);
        if (value.length >= 3) { // Trigger suggestions only after 3 characters
            getSuggestions(value);
        } else {
            setSuggestions([]);
        }
    }
    };
    const validateInput = (data) => {
        const { username, email, address, phone_number } = data;
        if (username === "" || email === "" || address === "" || phone_number === "") {
            return [false, 0];
        } else {
            return [true, data];
        }
    };

    const handleSave = async() => {
        const data = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            address: document.getElementById("address").value,
            phone_number: document.getElementById("phone_number").value,
        }
        const validResult = validateInput(data);
        if (validResult[0]) {
            const userData = validResult[1];
            const url = `${backend_origin}/user/edit/`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: 'include',
            }).then((data) => {
                    if (data.error) {
                        setEditedUser(user);
                        alert(data.error);
                        return;
                    }
                    data.json().then((userData) => {
                        console.log(userData);
                        dispatch(setUser(userData));
                        setEditedUser(userData);
                        setIsEditing(false);
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else{
            alert("不能将信息修改为空")
            setEditedUser(user)
        }
        
    };
    const handleCancel = () =>{
        setIsEditing(false); 
    }

    const getSuggestions = async (searchText) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchText}&access_token=${MAPBOX_ACCESS_TOKEN}&session_token=${sessionToken}&proximity=-113.49458748665292,53.527784713984516&country=CA`
            );
            const data = await response.json();
            console.log("Suggestions:", data.suggestions);
            setSuggestions(data.suggestions || []);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        console.log("Selected suggestion:", suggestion.full_address);
        setTempoAddress(suggestion.full_address);
        setSuggestions([]);
        setEditedUser({ ...editedUser, address: suggestion.full_address });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {

          if (
            addressInputRef.current && !addressInputRef.current.contains(event.target) &&
            suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target)
          ) {
            setSuggestions([]);
            setLoading(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    
    
    
    
    
    
    
    
    
    
    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            id="myInfoModal"
            aria-labelledby="myInfoModalLabel"
            aria-hidden="true"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative m-3">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-2xl font-bold" id="myInfoModalLabel">
                        我的信息
                    </h5>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => dispatch(setModalMyInfo())}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            用户名
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="username"
                                defaultValue={user.username}
                                id = "username"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                            />
                        ) : (
                            <p className="text-gray-900">{user.username || "未设置"}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            邮箱
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                id = "email"
                                defaultValue={user.email}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                            />
                        ) : (
                            <p className="text-gray-900">{user.email || "未设置"}</p>
                        )}
                    </div>
                    <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
                地址
            </label>
            

            {isEditing ? (
                <div className="relative">
                    <input
                        type="text"
                        name="address"
                        id = "address"
                        value={tempoAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="Enter address"
                        ref={addressInputRef}
                    />
                    {loading && <p className="text-sm text-gray-500">Loading suggestions...</p>}

                    {suggestions.length > 0 && (
                        <ul ref={suggestionBoxRef} className="text-gray-500 absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                >
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <p className="text-gray-900">{editedUser.address || "未设置"}</p>
            )}
        </div>
                    

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            电话号码
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="phone_number"
                                id = "phone_number"
                                defaultValue={user.phone_number}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                            />
                        ) : (
                            <p className="text-gray-900">{user.phone_number || "未设置"}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            房间号
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="room_number"
                                id = "room_number"
                                defaultValue={user.room_number}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                            />
                        ) : (
                            <p className="text-gray-900">{user.room_number || "N/A"}</p>
                        )}

                    </div>
                </div>

                <div className="flex justify-between">
                    {isEditing ? (
                        <div className="flex justify-between w-full">
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
                        >
                            保存
                        </button>
                        <button
                            className="bg-red-400 text-white py-2 px-4 rounded-md hover:bg-red-500 transition-colors duration-300"
                        onClick={handleCancel}
                        >取消</button>
                        </div>
                    ) : (
                        <div className="flex justify-between w-full">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
                        >
                            修改信息
                        </button>
                        {/* <button
                        className="bg-red-400 text-white"
                        >忘记密码</button> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyInfoModal;
