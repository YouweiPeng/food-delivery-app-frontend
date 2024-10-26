import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const BackButton = () => {
    const navigate = useNavigate();
    return ( 

        <IoArrowBackOutline
        className="text-4xl hover:cursor-pointer absolute top-1 left-1"
        onClick={() => navigate('/')}
        />

     );
}
 
export default BackButton;