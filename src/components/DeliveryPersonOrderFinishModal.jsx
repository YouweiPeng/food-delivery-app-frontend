import { useEffect, useState } from "react";

const DeliveryPersonOrderFinishModal = ({ order, closeFinishModal, finishOrderCallback }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;

    const handleFinishOrder = async (order) => {
        const url = `${backend_origin}/order/delivery/finish_order/`;
        
        // Use FormData for the request body to send the image file
        const formData = new FormData();
        formData.append("order_code", order.order_code);
        formData.append("id", order.id);
        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        const resData = await response.json();
        if (response.ok) {
            console.log(resData);
            finishOrderCallback();
            closeFinishModal();
        } else {
            console.error("Failed to finish order");
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-60">
            <div className="bg-white p-5 rounded-lg w-96 flex flex-col items-center justify-center">
                <p className="mt-2"><strong>订单号:</strong> {order.order_code}</p>
                <p className="mt-2"><strong>地址:</strong> {order.address}</p>
                <p className="mt-2"><strong>电话号码:</strong> {order.phone_number}</p>
                <p className="mt-2"><strong>邮箱:</strong> {order.email}</p>
                <p className="mt-2"><strong>价格:</strong> ${order.price}</p>
                <p className="mt-2"><strong>份数:</strong> {order.quantity}</p>
                <p className="mt-2"><strong>房间号:</strong> {order.room_number || "客户未填"}</p>
                <p className="mt-2"><strong>备注:</strong> {order.comment || "无备注"}</p>
                <h2 className="mt-2">您确定要完成这个订单吗?</h2>
                <p className="mt-2">请上传订单完成的图片</p>
                <input
                    type="file"
                    accept="image/*"
                    className="mt-5"
                    onChange={handleFileChange}
                />
                {selectedImage && (
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Order"
                        className="mt-4"
                        style={{ height: "200px" }}
                    />
                )}
                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        onClick={() => handleFinishOrder(order)}
                    >
                        完成
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                        onClick={closeFinishModal}
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryPersonOrderFinishModal;
