import React, { useState, useEffect } from 'react';
import MealCard from './MealCard';
import { getWeekDates, daysOfWeek} from '../utils/dateUtils';
import MealModal from './MealModal';
import { useSelector } from 'react-redux';

const MealGrid = () => {
  const { thisWeek, nextWeek, formattedDate } = getWeekDates();
  const [selectedDay, setSelectedDay] = useState(formattedDate);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const meals = useSelector((state) => state.interfaceSlice.mealInfo);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (Object.keys(meals).length > 0) {
      setIsLoading(false);
    }
  }, [meals]);

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };
  console.log("date")
  console.log(formattedDate)
  const selectedMeals = meals[selectedDay] || [];

  return (
    <div className="container mx-auto p-3">
      <h1 className="text-3xl font-bold mb-8 text-center">菜单 (Menu)</h1>
      <p className='p-3'>餐食日期：{getWeekDates().formattedDate}</p>
      <p className='font-light text-xs'>注：当天早上十点以后到第二天早上十点以前点餐都是第二天的餐食，当天晚上十二点前点餐为优惠价！</p>
      <p className='font-bold text-xs'>开始配送时间为：11：30 - 13:30</p>
      <div className="mb-6">
        <label htmlFor="daySelector" className="mr-2">选择日期:</label>
        <select id="daySelector" 
          onChange={handleDayChange} 
          className="p-2 border rounded dark:text-white dark:black"
          defaultValue={getWeekDates().formattedDate}
        >
          <optgroup label="本周">
            {thisWeek.map(day => (
              <option key={day.date} value={day.date}>
                {day.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="下周">
            {nextWeek.map(day => (
              <option key={day.date} value={day.date}>
                {day.label}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {isLoading ? (
        <p className="text-center">正在加载菜单... (Loading menu...)</p>
      ) : selectedMeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {selectedMeals.map((meal, index) => (
            <MealCard key={index} meal={meal} onClick={() => setSelectedMeal(meal)} />
          ))}
        </div>
      ) : (
        <p className="text-center">当天无餐食可显示 (No meals available for the selected day)</p>
      )}

      {selectedMeal && <MealModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />}
      <p className='font-light text-xs mt-5'>如需退款，需在配送当天9:30前退款</p>
    </div>
  );
};

export default MealGrid;
