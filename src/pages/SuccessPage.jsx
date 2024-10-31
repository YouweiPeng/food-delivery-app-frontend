import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Header from '../components/Header'
const SuccessPage = () => {
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
    const urlParams = new URLSearchParams(window.location.search);
    const { session_id } = useParams();
    
    useEffect(() => {
        if (session_id) {
            fetch(`${backend_origin}/stripe-session/${session_id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch session data');
                    }
                    return response.json();
                })
                .then((data) => {
                    setSessionData(data);
                    setLoading(false);
                    
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [session_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
<div className="max-w-lg mx-auto rounded-lg p-6">
    <Header />
    <BackButton />
    <h1 className="text-3xl font-bold text-center text-green-600 mb-6">付款成功</h1>
    <h2 className="text-xl font-semibold text-gray-700 mb-4">感谢您的订购</h2>
    {sessionData ? (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">订单信息</h2>
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-md"><strong>订单号:</strong> <span className="text-gray-800">{sessionData.order_code}</span></p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-md"><strong>地址:</strong> <span className="text-gray-800">{sessionData.address}</span></p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-md"><strong>电话:</strong> <span className="text-gray-800">{sessionData.phone_number}</span></p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-md"><strong>邮箱:</strong> <span className="text-gray-800">{sessionData.email}</span></p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-md"><strong>餐食数量:</strong> <span className="text-gray-800">{sessionData.quantity}</span></p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-md"><strong>房间号</strong> <span className="text-gray-800">{sessionData.room_number}</span></p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-md"><strong>餐价:</strong> <span className="text-gray-800">${sessionData.price}</span></p>
            </div>
        </div>
    ) : (
        <p className="text-red-500 text-center">No session data available.</p>
    )}
</div>

    );
};

export default SuccessPage;
