import {useDispatch, useSelector} from 'react-redux';
import { setCreditOrderConfirmModal } from '../store/interfaceSlice';
import { useRef } from 'react';
const CreditOrderConfirmModal = ({fee, addOnFee, totalPrice, formRef}) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.interfaceSlice.user);
    return ( 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="creditOrderConfirmModal" tabIndex="-1" aria-labelledby="creditOrderConfirmModalLabel" aria-hidden="true">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="creditOrderConfirmModalLabel">确认订单</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>餐价: $ {totalPrice}</p>
                        <p>配送费: $ {fee.toFixed(2)}</p>
                        <p>附加品费: $ {addOnFee.toFixed(2)}</p>
                        <p>税费(5%)$: {((Number(totalPrice)  + Number(addOnFee))*0.05).toFixed(2)}</p>
                        <p>总需支付$: {((Number(totalPrice)  + Number(addOnFee))*1.05 + fee).toFixed(2)}</p>
                        <p>您的余额:$ {user.credit}</p>
                        <p>您现有余额可以支付该订单，将在余额里扣除订单所需费用，确定下单吗？</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary"
                        onClick={() => formRef.current.submit()}
                        >确定</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                        onClick={() => dispatch(setCreditOrderConfirmModal(false))}
                        >取消</button>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default CreditOrderConfirmModal;