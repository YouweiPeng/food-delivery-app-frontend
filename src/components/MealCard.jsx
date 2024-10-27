import testPic from "../assets/test.png";
const MealCard = ({ meal, onClick }) => {
    return (
      <div onClick={onClick} className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-500 hover:scale-105 cursor-pointer">
        <img
          src={testPic}
          alt={meal.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold">{meal.name}</h2>
        </div>
      </div>
    );
  };
  
  export default MealCard;
  
  