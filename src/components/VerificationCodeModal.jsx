import React from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { setVerificationCodeModal } from '../store/interfaceSlice';
import { useState } from 'react';
const VerificationCodeModal = () => {
    const dispatch = useDispatch();
    const backend_origin = import.meta.env.VITE_BACKEND_ORIGIN;
    const user = useSelector((state) => state.interfaceSlice.user);
    const [newPassword, setNewPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const change_password = async () => {
        const response = await fetch(`${backend_origin}/user/change_password/`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password : newPassword,
                verification_code: verificationCode,
            }),
        });
        if (response.ok) {
            console.log("Password changed successfully");
            dispatch(setVerificationCodeModal(false));
        } else {
            alert("Failed to change password");
        }
    }
    return (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            
        <div className="bg-white p-8 rounded-lg w-96 relative">
            <button
                className="absolute top-4 right-4 bg-black text-white"
                onClick={() => dispatch(setVerificationCodeModal(false))}
            >
                ✕
            </button>

            <h1 className="text-2xl font-semibold text-center">输入验证码</h1>
            <p>我们已向您的邮箱发送验证码</p>
            <p>以下是您的信息，请确认</p>
            <p className='mt-5 tetx-start'>用户邮箱: {user.email}</p>
            <p>用户名: {user.username}</p>
            <input
                type="text"
                className="w-full border-b-2 border-black mt-6"
                placeholder="输入验证码"
                value = {verificationCode}
                onChange = {(e) => setVerificationCode(e.target.value)}
            />
            <input
                type="text"
                className="w-full border-b-2 border-black mt-6"
                placeholder="输入新密码"
                value = {newPassword}
                onChange = {(e) => setNewPassword(e.target.value)}
            />
            <button 
            className="bg-black text-white w-full mt-4 py-2 rounded-md"
            onClick={change_password}
            >
                确定
            </button>
        </div>
        </div>
     );
}
 
export default VerificationCodeModal;