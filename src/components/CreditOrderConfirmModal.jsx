import {useDispatch, useSelector} from 'react-redux';
import { setCreditOrderConfirmModal } from '../store/interfaceSlice';
import { useRef } from 'react';
const CreditOrderConfirmModal = ({addOnFee, totalPrice, formRef}) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.interfaceSlice.user);
    const fee = useSelector((state) => state.interfaceSlice.extraFee);
    const tax = Number(((Number(totalPrice)  + Number(addOnFee))*0.05).toFixed(2));
    const total = Number(((Number(totalPrice)  + Number(addOnFee))*1.05).toFixed(2)) + Number(fee);
    return ( 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="creditOrderConfirmModal" tabIndex="-1" aria-labelledby="creditOrderConfirmModalLabel" aria-hidden="true">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title" id="creditOrderConfirmModalLabel"
                        className="text-2xl font-bold mb-2"
                        >确认订单</h2>
                    </div>
                    <div className="modal-body">
                        <p>餐价: $ {totalPrice}</p>
                        <p>配送费: $ {fee}</p>
                        <p>附加品费: $ {addOnFee.toFixed(2)}</p>
                        <p>税费(5%)$: {tax}</p>
                        <p>总需支付$: {total}</p>
                        <p>您的余额:$ {user.credit}</p>
                        <p>您现有余额可以支付该订单，将在余额里扣除订单所需费用，确定下单吗？</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary bg-lime-300 text-black border-black border-2 mx-2"
                        onClick={() => formRef.current.submit()}
                        >确定</button>
                        <button type="button" className="btn btn-secondary bg-rose-300 text-black border-black border-2" data-bs-dismiss="modal"
                        onClick={() => dispatch(setCreditOrderConfirmModal(false))}
                        >取消</button>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default CreditOrderConfirmModal;