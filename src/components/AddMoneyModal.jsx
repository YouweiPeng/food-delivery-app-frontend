import {useDispatch, useSelector} from 'react-redux';
import { setAddMoneyModal } from '../store/interfaceSlice';
import { useRef } from 'react';
const AddMoneyModal = () => {
    const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const user = useSelector((state) => state.interfaceSlice.user);
    const handleAddMoney = async(amount, bouns) => {
        formRef.current.querySelector('#amount').value = amount;
        formRef.current.querySelector('#bouns').value = bouns;
        formRef.current.querySelector('#uuid').value = user.uuid;
        formRef.current.submit();
    }
    return ( 
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
            className='bg-white p-8 rounded-lg w-96 relative flex flex-col items-center'
            >
                <button
                className="absolute top-4 right-4 font-bold"
                onClick={() => dispatch(setAddMoneyModal(false))}
                >
                    ✕
                </button>

                <h2>充值有优惠，多充多送</h2>
                <button className='mt-5 bg-blue-500 text-white'
                onClick={() => handleAddMoney(100, 10)}
                >充值100送10元</button>
                <button className='mt-5 bg-blue-500 text-white'
                onClick={() => handleAddMoney(200, 25)}
                >充值200送25元</button>
            </div>

            <form className='hidden' 
            action={`${backend_origin}/create-checkout-session-add-money/`}
            method="POST"
            onSubmit={handleAddMoney}
            ref={formRef}
            >
                <input type="float" id='amount' name='amount'/>
                <input type="float" id='bouns' name= 'bouns'/>
                <input type="text" id ='uuid' name= 'uuid'/>
            </form>
        </div>
     );
}
 
export default AddMoneyModal;