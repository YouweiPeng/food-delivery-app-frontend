import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import ComboSelectionPage from './pages/ComboSelectionPage';
import {useSelector, useDispatch} from 'react-redux';
import { setMealInfo, setModalInfo, setIsLoggin, setUser } from './store/interfaceSlice';
import { mealsByDay } from './utils/testData';
import { daysOfWeek, getWeekDates } from './utils/dateUtils';
import SuccessPage from './pages/SuccessPage';
import DeliveryPersonPage from './pages/DeliveryPersonPage';
function App() {
  const [mealsData, setMealsData] = useState({});
  const BackEndOrigin = import.meta.env.VITE_BACKEND_ORIGIN;
  const dispatch = useDispatch();
  const mealInfo = useSelector((state) => state.interfaceSlice.mealInfo);
  const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
  const IsLoggin = useSelector((state) => state.interfaceSlice.isLoggin);
  const user = useSelector((state) => state.interfaceSlice.user);
  console.log(mealsByDay)
  console.log(mealInfo)
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const response = await fetch(`${backend_origin}/user/auto_login/`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
        if (response.ok && data.loggedIn) {
          dispatch(setUser({
            username: data.username,
            email: data.email,
            address: data.address,
            phone_number: data.phone_number,
            uuid: data.uuid,
            room_number: data.room_number,
            is_staff: data.is_staff,
          }));
          console.log("Auto login info", data);
          dispatch(setIsLoggin(true));
          console.log("Auto login successful.");
        }
      } catch (error) {
        console.error("Auto login failed:", error);
      }
    };

    checkAutoLogin();
  }, [dispatch]);

  useEffect(() => {
    console.log("IsLoggin updated:", IsLoggin);
}, [IsLoggin]);
  // useEffect(() => {
  //   const fetchAllMeals = async () => {
  //     const url = `${BackEndOrigin}/order/food/`;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setMealsData(data);
  //   };
  //   fetchAllMeals();
  // }, [BackEndOrigin]);
  // useEffect(() => {
  //   if (Object.keys(mealsData).length > 0) {
  //     console.log(mealsData);
      
  //     const formatData = () => {
  //       const time = getWeekDates().today;
  //       console.log(`Today is: ${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${time.getDate()}`);
  //       let numDayOfWeek = time.getDay() - 1;
  //       if (numDayOfWeek < 0) {
  //         numDayOfWeek = 6;
  //       }
  //       console.log(numDayOfWeek);
  //       const currentDayOfWeek = daysOfWeek[numDayOfWeek];

  //       console.log("Today is", currentDayOfWeek);
        
  //       time.setTime(time.getTime() - (numDayOfWeek * 24 * 60 * 60 * 1000));
  //       let formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate() >=10?time.getDate():'0'+time.getDate()}`
  //       console.log('Monday of the current week is', formatTime);
  //       if (!mealsData['Week_1'] || !mealsData['Week_2']) {
  //         console.error("Week_1 or Week_2 is missing from mealsData.");
  //         return;
  //       }

  //       // change the start date in here, now it is 2024-10-14
  //       const weekDifference = Math.floor((time.getTime() - new Date(2024, 9, 14).getTime()) / (7 * 24 * 60 * 60 * 1000));
  //       console.log('we started', weekDifference, "weeks");
  //       const parity = weekDifference % 2 === 0 ? 'even' : 'odd';
  //       console.log('This week is', parity);
  //       const res = {};
  //       if (parity === 'even') {
  //         for (let i = 0; i < 7; i++) {
  //           res[formatTime] = mealsData['Week_1'][daysOfWeek[i]] || [];
  //           time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
  //           formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate() >=10?time.getDate():'0'+time.getDate()}`
  //         }
  //         for (let i = 0; i < 7; i++) {
  //           res[formatTime] = mealsData['Week_2'][daysOfWeek[i]] || [];
  //           time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
  //           formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate()>=10?time.getDate():'0'+time.getDate()}`
  //         }
  //       } else {
  //         for (let i = 0; i < 7; i++) {
  //           res[formatTime] = mealsData['Week_2'][daysOfWeek[i]] || [];
  //           time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
  //           formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate() >=10?time.getDate():'0'+time.getDate()}`
  //         }
  //         for (let i = 0; i < 7; i++) {
  //           res[formatTime] = mealsData['Week_1'][daysOfWeek[i]] || [];
  //           time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
  //           formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate() >=10?time.getDate():'0'+time.getDate()}`
  //         }
  //       }
  
  //       console.log(res.data);
  //       dispatch(setMealInfo(res));
  //     };
  
  //     formatData();
  //   }
  // }, [mealsData]);

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await fetch(`${backend_origin}/order/get_menu/`);
      const data = await response.json();
      console.log("menu")
      console.log(data);
      setMealsData(data);
    }
    fetchMenu();
  }, [backend_origin]);

  useEffect(() => {
    console.log("mealsData updated:", mealsData)
  }, [mealsData]);
  useEffect(() => {
      const format_data = () => {
        const time = getWeekDates().today;
        console.log(`Today is: ${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${time.getDate()}`);
        let numDayOfWeek = time.getDay() - 1;
        if (numDayOfWeek < 0) {
          numDayOfWeek = 6;
        }
        console.log(numDayOfWeek);
        const currentDayOfWeek = daysOfWeek[numDayOfWeek];

        console.log("Today is", currentDayOfWeek);
        
        time.setTime(time.getTime() - (numDayOfWeek * 24 * 60 * 60 * 1000));
        let formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate() >=10?time.getDate():'0'+time.getDate()}`
        console.log('Monday of the current week is', formatTime);
        // change the start date in here, now it is 2024-10-14
        const weekDifference = Math.floor((time.getTime() - new Date(2024, 10, 4).getTime()) / (7 * 24 * 60 * 60 * 1000));
        console.log('we started', weekDifference, "weeks");
        const parity = weekDifference % 2 === 0 ? 'even' : 'odd';
        console.log('This week is', parity);
        const res = {};
        if (parity === 'even') {
          for (let i = 0; i < 7; i++) {
            res[formatTime] = mealsData[0][daysOfWeek[i]] || [];
            time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
            formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate() >=10?time.getDate():'0'+time.getDate()}`
          }
          for (let i = 0; i < 7; i++) {
            res[formatTime] = mealsData[1][daysOfWeek[i]] || [];
            time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
            formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate()>=10?time.getDate():'0'+time.getDate()}`
          }
        }
        else {
          for (let i = 0; i < 7; i++) {
            res[formatTime] = mealsData[1][daysOfWeek[i]] || [];
            time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
            formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate() >=10?time.getDate():'0'+time.getDate()}`
          }
          for (let i = 0; i < 7; i++) {
            res[formatTime] = mealsData[0][daysOfWeek[i]] || [];
            time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
            formatTime = `${time.getFullYear()}-${(time.getMonth() + 1) >= 10? time.getMonth() + 1:'0' + (time.getMonth() + 1)}-${ time.getDate() >=10?time.getDate():'0'+time.getDate()}`
          }
        }
        console.log("res")
        console.log(res);
        dispatch(setMealInfo(res));
      }
      if (Object.keys(mealsData).length > 0) {
        format_data();
      }
  }, [mealsData])
  return (
    <BrowserRouter>
    <Header />
      <div className={`bg-lime-100 w-full flex flex-col items-center justify-center relative ${!user.is_staff ?"mt-[14.28vh]":"" } `} style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={ !user.is_staff?<HomePage/>:<DeliveryPersonPage/>} />
          <Route path="/checkout" element={<CheckoutPage/>} />
          <Route path="/combo" element={<ComboSelectionPage />} />
          <Route path="/success/:session_id" element={<SuccessPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
