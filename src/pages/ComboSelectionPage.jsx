import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import BackButton from "../components/BackButton";
import Header from "../components/Header";
const ComboSelectionPage = () => {
    const navigate = useNavigate();
    return ( 
        <div>
            <Header />
            <BackButton />
                敬请期待团餐
        </div>
     );
}
 
export default ComboSelectionPage;
