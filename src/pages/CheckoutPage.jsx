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
import { Input } from 'antd';
import AddOn from '../components/AddOn';
const CheckoutPage = () => {
  const { TextArea } = Input;
  const formRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const hour = new Date().getHours();
  let unitPrice = hour < 24 && hour > 10 ? 23 : 25;
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
  const coordinates = useSelector((state) => state.interfaceSlice.coordinates);
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [coke, setCoke] = useState(0);
  const [sevenUp, setSevenUp] = useState(0);
  const [sprite, setSprite] = useState(0);
  const [canadaDry, setCanadaDry] = useState(0);
  const [icetea, setIcetea] = useState(0);
  const [addOnFee, setAddOnFee] = useState(0);
  const [addOns, setAddOns] = useState("");

  useEffect(() => {
    setAddress(userData.address || "");
    setRoomNumber(userData.room_number || "");
    setPhoneNumber(userData.phone_number || "");
    setEmail(userData.email || "");
  }, [userData]);
  const submitForm = () => {
    const currentHour = new Date().getHours();
    unitPrice = currentHour < 24 && currentHour > 10 ? 23 : 25;
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
      formRef.current.querySelector("input[name='lon']").value = coordinates[0][0];
      formRef.current.querySelector("input[name='lat']").value = coordinates[0][1];
      formRef.current.querySelector("input[name='addOn']").value = get_add_on_string();
      formRef.current.querySelector("input[name='addOnFee']").value = (coke + sevenUp + sprite + canadaDry + icetea) * 3;
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
      else if(address[i] === '#'){
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
      console.log("This is the coordinates",customer_coordinate);
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
  const get_add_on_string = () => {
    let add_on_string = "";
    if(coke > 0){
      add_on_string += `可乐 * ${coke} \n`;
    }
    if(sevenUp > 0){
      add_on_string += `七喜 * ${sevenUp} \n`;
    }
    if(sprite > 0){
      add_on_string += `雪碧 * ${sprite} \n`;
    }
    if(canadaDry > 0){
      add_on_string += `Canada Dry * ${canadaDry} \n`;
    }
    if(icetea > 0){
      add_on_string += `冰红茶 * ${icetea} \n`;
    }
    return add_on_string;
  }
  return (
    <section className='flex flex-col text-center gap-y-4 items-center p-4'>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">点单餐食 (Order Items)</h2>
        <p className='p-2'>餐食日期：{formattedDate}</p>
        {loading ? (
          <p className="text-center">正在加载餐食... (Loading meals...)</p>
        ) : todaysMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {todaysMeals.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))}
          </div>
        ) : (
          <p className="text-center">今天没有餐食可显示 (No meals available for today)</p>
        )}
      </div>

      <BackButton />

      <div className="product w-2/3">
        <div className="description">
          <h3 className={`font-bold ${unitPrice<25?"text-lime-700":""}`}>{unitPrice<25?"优惠价:":"单价:"} ${unitPrice.toFixed(2)}</h3>
        </div>
          <AddOn
            coke={coke} setCoke={setCoke}
            sevenUp={sevenUp} setSevenUp={setSevenUp}
            sprite={sprite} setSprite={setSprite}
            canadaDry={canadaDry} setCanadaDry={setCanadaDry}
            icetea={icetea} setIcetea={setIcetea}
          />
      </div>
      <form
        action={`${backend_origin}/create-checkout-session/`}
        method="POST"
        onSubmit={handleSubmitOrder}
        className='flex flex-col w-5/6 max-w-56 gap-y-4'
        ref={formRef}
      >

        <div>
        <label htmlFor="quantity">餐食数量</label>
        <Input
          size = 'large'
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
        </div>
        <div>


        
        <label htmlFor="address">地址</label>
        <Input
          size = 'large'
          type="text" 
          id="address" 
          required 
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className='text-gray-900 p-3'
          placeholder='请输入地址 (Please enter your address)'
        />
        </div>
        <div>
          <label htmlFor="room_number">房间号 可选填</label>
          <Input
            size = 'large'
            type="text" 
            id="room_number" 
            name="room_number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className='text-gray-900 p-3'
            placeholder='请输入房间号 (Please enter your room number)'
          />
        </div>
        <div>

        <label htmlFor="number">电话号码</label>
        <Input
          size = 'large'
          type="tel" 
          placeholder="(780)-123-4567" 
          id="number" 
          required 
          name="phone_number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className='text-gray-900 p-3'
        />
        </div>

        <div>
        <label htmlFor="email">邮箱</label>
        <Input
          size = 'large' 
          type="email" 
          id="email" 
          required
          name="email"
          className='text-gray-900 p-3'
          placeholder='请输入邮箱 (Please enter your email)'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        <div>

        <label htmlFor="note">备注(选填)</label>
        <TextArea name="comment" id="note" 
        placeholder='请在此处输入备注, 如过敏信息，特殊要求'
        autoSize={{ minRows: 3, maxRows: 5 }} className='text-gray-900 p-3'/>
        </div>
        <h3 className='font-black text-xl'>
          {isNaN(totalPrice) || quantity > 30 ? "数量有误" : `餐价:$${totalPrice}`}
        </h3>

        <input type="hidden" name="total_price" value={totalPrice} />
        <input type="hidden" name="uuid" value={userData.uuid ||""} />
        <input type="hidden" name="content" value={formattedTodayMeals} />
        <input type="hidden" name="extraFee" value={fee} />
        <input type="hidden" name="lon"/>
        <input type="hidden" name="lat"/>
        <input type="hidden" name="addOnFee" />
        <input type="hidden" name="addOn" />
        <button 
        className='bg-green-500 text-white p-2 rounded-md'
        type="submit">订购餐食</button>
      </form>
      {isAddressConfirmModalOpen && <AddressConfirmModal onConfirm={submitForm}/>}
    </section>
  );
};

export default CheckoutPage;
