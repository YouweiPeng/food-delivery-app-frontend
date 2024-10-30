import React from 'react';

const OrderCancelModal = ({ onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                <h3 className="text-lg font-semibold mb-4">
                   您确定要取消订单吗？
                </h3>
                <p>
                    取消订单后，由于Stripe支付平台政策，您将会被扣除6%-10%的手续费。退款会在几天内退回到您的支付账户。
                </p>
                <div className="flex justify-between mt-6">
                    <button 
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        放弃取消
                    </button>
                    <button 
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={onConfirm}
                    >
                        狠心取消
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderCancelModal;
