import { useSelector, useDispatch } from "react-redux";
import { setModalLogin, setUser,setIsLoggin } from "../store/interfaceSlice";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef } from "react";
const LoginModal = () => {
  const dispatch = useDispatch();
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and registration
  const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
  const [address, setAddress] = useState(''); // Temp state for address input
  const [suggestions, setSuggestions] = useState([]); // Store suggestions from Mapbox
  const [loading, setLoading] = useState(false); 
  const [sessionToken] = useState(uuidv4());
  const addressInputRef = useRef(null); // Ref for the address input
  const suggestionBoxRef = useRef(null); // Ref for the suggestion box
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const toggleRegister = () => {
    setIsRegistering(!isRegistering); // Toggle between login and register view
  };
  const validateInput = () => {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const email = document.getElementById('email').value
    const address = document.getElementById('address').value
    const phone_number = document.getElementById('phone').value
    const room_number = document.getElementById('room_number').value || 'N/A'

    if (username ==='' || password ==='' || email ===''|| address ===''|| phone_number === ''){
      alert("请输入注册需要的信息")
      return [false, 0]
    }
    else{
      const data = {username, password, email, address, phone_number, room_number}
      return [true, data]
    }
  }
  const handleRegister = async (e) =>{
    e.preventDefault();
    const validResult = validateInput()
    if (validResult[0]){
      const userData = validResult[1]
      const url = `${backend_origin}/user/signup/`
      const response = await fetch(url,{
        method : 'POST',
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify(userData)
      }
      ).then(data => {
        
        //成功注册后登陆
        data.json().then(uData => {
        if (uData.error){
          alert(uData.error)
          return
        }
        dispatch(setIsLoggin(true))
        dispatch(setUser({
          username:userData.username, 
          email:userData.email, 
          address: userData.address, 
          phone_number: userData.phone_number, 
          password:userData.password,
          uuid:uData.uuid,
          is_staff: uData.is_staff,
          room_number:userData.room_number}))
        console.log("register  info", {
          username:userData.username, 
          email:userData.email, 
          address: userData.address, 
          phone_number: userData.phone_number, 
          password:userData.password,
          uuid:uData.uuid,
          is_staff: uData.is_staff,
          room_number:userData.room_number
        })
        dispatch(setModalLogin())
        })

      }).catch(err => {
        console.log(err)
      }
      )
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    if (username === '' || password === '') {
      alert("无效登录信息");
      return;
    }
    const userData = { username, password };
    const url = `${backend_origin}/user/login/`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
  
      const data = await response.json();
      if (response.ok) {
        dispatch(setUser({
          username: data.username,
          email: data.email,
          address: data.address,
          phone_number: data.phone_number,
          uuid: data.uuid,
          room_number: data.room_number,
          is_staff: data.is_staff,
        }));
        console.log("login info", data)
        dispatch(setIsLoggin(true));
        dispatch(setModalLogin());
      } else {
        alert(data.error || '登录失败');
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert('登录失败');
    }
  };
  const getSuggestions = async (searchText) => {
    setLoading(true);
    try {
      const response = await fetch(
         `https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchText}&access_token=${MAPBOX_ACCESS_TOKEN}&session_token=${sessionToken}&proximity=-113.49458748665292,53.527784713984516&country=CA`
      );
      const data = await response.json();
      console.log(data.suggestions);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value.length >= 3) { // Trigger suggestions after 3 characters
      getSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.full_address); // Set the input value to the selected suggestion
    setSuggestions([]); // Clear the suggestions after a selection is made
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addressInputRef.current && !addressInputRef.current.contains(event.target) &&
        suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target)
      ) {
        setSuggestions([]);
        setLoading(false); // Stop loading when clicking outside the address field or suggestions box
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
      id="loginModal"
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative m-3">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-2xl font-bold" id="loginModalLabel">
            {isRegistering ? "注册" : "登录"}
          </h5>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => dispatch(setModalLogin())}
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
          <form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                {isRegistering ? "用户名" : "用户名或邮箱"}
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder={isRegistering ? "用户名" : "用户名或邮箱"}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {isRegistering ? "设置密码" : "密码"}
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder={isRegistering ? "设置密码" : "输入密码"}
                required
              />
            </div>
            {
              isRegistering && (
                <div className="mb-4">

              <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                  required
                >
                  地址
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    placeholder="设置地址"
                    ref={addressInputRef}
                    required
                  />
                  {loading && <p className="text-sm text-gray-500">Loading suggestions...</p>}

                  {suggestions.length > 0 && (
                    <ul ref={suggestionBoxRef} className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg text-gray-500">
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
                  <label htmlFor="room_number"
                  className="block text-sm font-medium text-gray-700"
                
                  >
                  房间号(选填)
                  </label>
                  <input type="text" 
                  id = "room_number"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="房间号(选填)"
                  />

                  <label htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                  >电话</label>
                  <input type="text"
                  id = "phone"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="电话号码"
                  required
                  />


                  <label htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                  >邮箱</label>
                  <input type="email" 
                  id = "email"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="邮箱"
                  required
                  />
                  </div>
              )

            }
            {!isRegistering ? (
              <div className="my-5">
                <a
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={toggleRegister}
                >
                  没有账号？点击注册
                </a>
              </div>
            ): (
            
              <div className="my-5">
                <a
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={toggleRegister}
                >
                  已有账号？去登录
                </a>
              </div>
            )
            }

              {isRegistering ? (
                <button
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                  onClick={handleRegister}
                >
                  注册
                  </button>
              ) : (
            <button
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                onClick={handleLogin}
              >
                登录
              </button>
              )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
