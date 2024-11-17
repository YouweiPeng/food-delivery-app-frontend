/* eslint-disable react/prop-types */
import testPic from "../assets/test.png";

const MealModal = ({ meal, onClose }) => {
  // console.log(meal);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-md w-full mx-4 md:mx-0">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
          <img src={`data:image/png;base64, ${meal.picture}`} alt={meal.name} className="w-full max-h-60 object-cover" />
          <div className="p-6 max-h-48 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">{meal.name}</h2>
            <p className="text-gray-700">
              {meal.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealModal;
