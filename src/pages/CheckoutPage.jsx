import { useEffect, useState,useRef } from 'react';
import BackButton from "../components/BackButton";
import MealCard from '../components/MealCard';
import { useSelector, useDispatch } from 'react-redux';
import { getWeekDates } from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';
import AddressConfirmModal from '../components/AddressConfirmModal';
import {setModalAddressConfirm} from '../store/interfaceSlice'
import {setRoute, setDistance, setCoordinates} from '../store/interfaceSlice'
import { setExtraFee } from '../store/interfaceSlice';
import { set } from 'date-fns';
const CheckoutPage = () => {
  const formRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const hour = new Date().getHours();
  let unitPrice = hour < 24 && hour > 10 ? 19.8 : 22;
  const today = getWeekDates().today;
  const formattedDate = getWeekDates().formattedDate;
  const meals = useSelector((state) => state.interfaceSlice.mealInfo || {});
  const fee = useSelector((state) => state.interfaceSlice.extraFee);
  const userData = useSelector((state) => state.interfaceSlice.user);
  const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
  const [loading, setLoading] = useState(true);
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const isAddressConfirmModalOpen = useSelector((state) => state.interfaceSlice.isAddressConfirmModalOpen);
  const [sessionToken] = useState(uuidv4());
  
  const dispatch = useDispatch();
  const submitForm = () => {
    // re-check the unit price
    const currentHour = new Date().getHours();
    unitPrice = currentHour < 24 && currentHour > 10 ? 19.8 : 22;
    const today = new Date();
    if (today.getHours() >= 10) {
      today.setTime(today.getTime() + (24 * 60 * 60 * 1000));
    }
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1) >= 10? today.getMonth() + 1:'0' + (today.getMonth() + 1)}-${ today.getDate() > 10?today.getDate():'0'+ today.getDate()}`;
    const todaysMeals = meals[formattedDate] || [];
    const formattedTodayMeals = todaysMeals.map((meal) => meal.name);
    if (formRef.current) {
      formRef.current.querySelector("input[name='total_price']").value = (unitPrice * quantity).toFixed(2);
      formRef.current.querySelector("input[name='content']").value = formattedTodayMeals;
      formRef.current.submit();
    }
  };
  
  useEffect(() => {
    if (Object.keys(meals).length > 0) {
      setLoading(false);
    }
  }, [meals]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
  };

  const totalPrice = (unitPrice * quantity).toFixed(2);
  const todaysMeals = meals[formattedDate] || [];
  const formattedTodayMeals = todaysMeals.map(meal => meal.name);

  const handleSubmitOrder = (event) => {
    event.preventDefault();
    let address = event.target.address.value; 
    // remove & in address
    for(let i = 0; i < address.length; i++){
      if(address[i] === '&'){
        address = address.slice(0, i) + address.slice(i+1);
      }
    }
    const get_coordinate = async () => {
      const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${address}&access_token=${MAPBOX_ACCESS_TOKEN}&session_token=${sessionToken}&proximity=-113.49458748665292,53.527784713984516&country=CA`
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.suggestions.length === 0) {
        alert("地址无效，请重新输入 (Invalid address, please re-enter)");
        return;
      }
      const map_box_id =  data.suggestions[0].mapbox_id;
      const url2 = `https://api.mapbox.com/search/searchbox/v1/retrieve/${map_box_id}?access_token=${MAPBOX_ACCESS_TOKEN}&session_token=${sessionToken}`
      const response2 = await fetch(url2);
      const data2 = await response2.json();
      const customer_coordinate = [data2.features[0].geometry.coordinates, data.suggestions[0].name];
      dispatch(setCoordinates(customer_coordinate));
      const get_distance = async () => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${customer_coordinate[0]}, ${customer_coordinate[1]};-113.520787,53.525665?&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
        const response = await fetch(url);
        const data = await response.json();
        const distance_in_km = (data.routes[0].distance/1000).toFixed(2);
        const route = data.routes[0].geometry;
        dispatch(setModalAddressConfirm());
        dispatch(setRoute(route));
        dispatch(setDistance(distance_in_km));
      }
      get_distance();
    }
    get_coordinate();
    // event.target.submit();
  };

  return (
    <section className='flex flex-col text-center gap-y-4 items-center p-4'>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">点单餐食 (Order Items)</h2>
        <p className='p-2'>餐食日期：{formattedDate}</p>
        {loading ? (
          <p className="text-center">正在加载餐食... (Loading meals...)</p>
        ) : todaysMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {todaysMeals.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))}
          </div>
        ) : (
          <p className="text-center">今天没有餐食可显示 (No meals available for today)</p>
        )}
      </div>

      <BackButton />

      <div className="product">
        <div className="description">
          <h3 className={`font-bold ${unitPrice<20?"text-lime-700":""}`}>{unitPrice<20?"优惠价:":"单价:"} ${unitPrice.toFixed(2)}</h3>
        </div>
      </div>
      <form
        action={`${backend_origin}/create-checkout-session/`}
        method="POST"
        onSubmit={handleSubmitOrder}
        className='flex flex-col w-3/6 max-w-56'
        ref={formRef}
      >
        <label htmlFor="quantity">餐食数量</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min={1}
          max={30}
          required
          className='text-gray-900'
        />

        <label htmlFor="address">地址</label>
        <input 
          type="text" 
          id="address" 
          required 
          name="address"
          className='text-gray-900'
          defaultValue={userData.address}
        />

        <label htmlFor="number">电话号码</label>
        <input 
          type="tel" 
          placeholder="(780)-123-4567" 
          id="number" 
          required 
          name="phone_number"
          className='text-gray-900'
          defaultValue={userData.phone_number}
        />

        <label htmlFor="email">邮箱</label>
        <input 
          type="email" 
          id="email" 
          required
          name="email"
          className='text-gray-900'
          defaultValue={userData.email}
        />

        <label htmlFor="note">备注(选填)</label>
        <textarea name="comment" id="note" rows={3}></textarea>

        <h3 className='font-black text-xl'>
          {isNaN(totalPrice) || quantity > 30 ? "数量有误" : `餐价:$${totalPrice}`}
        </h3>

        <input type="hidden" name="total_price" value={totalPrice} />
        <input type="hidden" name="uuid" value={userData.uuid} />
        <input type="hidden" name="content" value={formattedTodayMeals} />
        <input type="hidden" name="extraFee" value={fee} />
        <button type="submit">订购餐食</button>
      </form>
      {isAddressConfirmModalOpen && <AddressConfirmModal onConfirm={submitForm}/>}
    </section>
  );
};

export default CheckoutPage;
