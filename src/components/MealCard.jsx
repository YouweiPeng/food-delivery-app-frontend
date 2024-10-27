import testPic from "../assets/test.png";
const MealCard = ({ meal, onClick }) => {
  console.log(meal);
    return (
      <div onClick={onClick} className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-500 hover:scale-105 cursor-pointer">
        <img
        // {`data:image/png;base64,${selectedImage}`}
          src={`data:image/png;base64, ${meal.picture_base64}`}
          alt={meal.name}
          draggable="false"
          className="w-full h-48 object-cover pointer-events-none"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold">{meal.name}</h2>
        </div>
      </div>
    );
  };
  
  export default MealCard;
  
  