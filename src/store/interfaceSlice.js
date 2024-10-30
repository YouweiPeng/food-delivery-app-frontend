import {createSlice} from '@reduxjs/toolkit';
import { set } from 'date-fns';
import { act } from 'react';

const initialState = {
    isLoggin: false,
    mealInfo: {},
    modalInfo: false,
    user:{},
    modalLogin: false,
    modalMyInfo: false,
    modalMyOrders: false,
    user_orders: [],
    distance : 0,
    route : "",
    isAddressConfirmModalOpen: false,
    coordinates : [],
    extraFee: 0,
    orderCancelModal: false,
};

const interfaceSlice = createSlice({
    name: 'interface',
    initialState,
    reducers: {
        setMealInfo: (state, action) => {
            state.mealInfo = action.payload
        },
        setModalInfo: (state) =>{
            state.mealInfo = !state.modalInfo
        },
        setModalLogin: (state) => {
            state.modalLogin = !state.modalLogin
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setIsLoggin: (state, action) => {
            state.isLoggin = action.payload
        },
        setModalMyInfo: (state) => {
            state.modalMyInfo = !state.modalMyInfo
        },
        setModalMyOrders: (state) => {
            state.modalMyOrders = !state.modalMyOrders
        },
        setUserOrders: (state, action) => {
            state.user_orders = action.payload
        },
        setDistance: (state, action) => {
            state.distance = action.payload
        },
        setRoute: (state, action) => {
            state.route = action.payload
        },
        setModalAddressConfirm: (state) => {
            state.isAddressConfirmModalOpen = !state.isAddressConfirmModalOpen
        },
        setCoordinates: (state, action) => {
            state.coordinates = action.payload
        },
        setExtraFee: (state, action) => {
            state.extraFee = action.payload
        },
        setOrderCancelModal:(state, action) =>{
            state.orderCancelModal = action.payload
        }

    
    }
    });


export const {setMealInfo, setModalInfo, setModalLogin, setUser, setIsLoggin,setModalMyInfo,setModalMyOrders, setUserOrders, setDistance, setRoute, setModalAddressConfirm, setCoordinates, setExtraFee, setOrderCancelModal} = interfaceSlice.actions;
export default interfaceSlice.reducer;