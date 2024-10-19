import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const ComboSelectionPage = () => {
    const navigate = useNavigate();
    return ( 
        <div>
            <IoArrowBackOutline
            className="text-4xl hover:cursor-pointer absolute top-20 left-10"
            onClick={() => navigate('/')}
            />
            This is the Combo Selection Page
            这是团餐选择页面
        </div>
     );
}
 
export default ComboSelectionPage;
