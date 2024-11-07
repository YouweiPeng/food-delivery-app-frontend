import React, { useState } from 'react';
import { setModalMyOrders, setOrderCancelModal, setUserOrders} from '../store/interfaceSlice';
import { useDispatch, useSelector } from 'react-redux';
import OrderCancelModal from './OrderCancelModal';
import { getWeekDates } from '../utils/dateUtils';
import { format, parseISO } from 'date-fns';
const MyOrdersModal = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.interfaceSlice.user);
  const user_orders = useSelector((state) => state.interfaceSlice.user_orders);
  const IsOrderCancelModal = useSelector((state) => state.interfaceSlice.orderCancelModal);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null); // Track the specific order to cancel
  const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};
  const handleCancelOrder = (order) => {
    console.log('Order Cancel');
    console.log(order);
    const cancelOrder = async () => {
      const url = `${backend_origin}/order/cancel_order/${order.order_code}/${user.uuid}`
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const updatedOrders = user_orders.map((o) =>
          o.id === order.id ? { ...o, status: 'refunded' } : o
        );
        dispatch(setUserOrders(updatedOrders));
      }
    }
    cancelOrder();
    setCancelOrderId(null);
    dispatch(setOrderCancelModal(false));
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const enlargeImage = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-4/5 overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Orders</h2>
          <button onClick={() => dispatch(setModalMyOrders())} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {user_orders.length === 0 ? (
            <p className="text-center text-gray-500">您暂时还没有订单</p>
          ) : (
            user_orders.map((order) => (
              <div key={order.id} className="bg-gray-100 rounded-lg p-4 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">订单号: {order.order_code}</p>
                    <p className="text-gray-600">日期: {formatDate(order.date)}</p>
                    <p className="text-gray-600">价格: <strong>${order.price}</strong></p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-white mt-2 ${
                        order.status === 'delivered' ? 'bg-green-500' :
                        order.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    >
                      {order.status === 'pending' ? "配送中" : order.status === 'delivered' ? "已送达" : "已取消"}
                    </span>
                    {order.status === 'pending' && 
                      new Date() < new Date(order.cancel_time) &&
                    (
                      <button
                        onClick={() => {
                          setCancelOrderId(order.id);
                          dispatch(setOrderCancelModal(true));
                        }}
                        className="text-white mx-2 bg-red-500 inline-block px-2 py-1 rounded text-white mt-2"
                      >
                        取消订单
                      </button>
                    )}
                    {IsOrderCancelModal && cancelOrderId === order.id && (
                      <OrderCancelModal
                        onCancel={() => dispatch(setOrderCancelModal(false))}
                        onConfirm={() => handleCancelOrder(order)}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="text-blue-500 hover:underline"
                  >
                    {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
                
                {expandedOrderId === order.id && (
                  <div className="mt-4">
                    <p className="mt-2"><strong>地址:</strong> {order.address}</p>
                    <p><strong>电话:</strong> {order.phone_number}</p>
                    <p><strong>餐数:</strong> {order.quantity}</p>
                    <p><strong>备注:</strong> {order.comment || 'No comments'}</p>
                    <p><strong>附加:</strong> {order.addOns || '无附加'}</p>
                    {order.image && (
                      <div className="mt-4 flex flex-col items-center justify-center">
                        <h3 className="font-bold">照片(点击可放大):</h3>
                        <img
                          src={`data:image/png;base64,${order.image}`}
                          alt="Order"
                          className="mt-2 w-1/2 cursor-pointer"
                          onClick={() => enlargeImage(order.image)} // Open image modal on click
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {isImageModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60"
            onClick={closeImageModal}
          >
            <div className="relative">
              <button
                onClick={closeImageModal}
                className="absolute top-0 right-0 text-white text-2xl p-2"
              >
                ✕
              </button>
              <img
                src={`data:image/png;base64,${selectedImage}`}
                alt="Order Full Size"
                className="max-w-full max-h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersModal;
