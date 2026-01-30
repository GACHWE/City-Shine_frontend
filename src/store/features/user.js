// import { createSlice } from "@reduxjs/toolkit"

// export const initialState = {
//     userInfo: {},
//     orders:[],
// }

// export const userSlice = createSlice({
//     name:'userSlice',
//     initialState,
//     reducers:{
//         loadUserInfo : (state,action)=>{
//             return {
//                 ...state,
//                 userInfo:action?.payload
//             }
//         },
//         saveAddress : (state,action)=>{
//             const addresses = [...state?.userInfo?.addressList] ?? [];
//             addresses.push(action?.payload);
//             return {
//                 ...state,
//                 userInfo:{
//                     ...state?.userInfo,
//                     addressList:addresses
//                 }
//             }
//         },
//         updateAddress : (state,action)=>{
//             const addresses = [...state?.userInfo?.addressList] ?? [];
//             addresses.push(action?.payload);
//             return {
//                 ...state,
//                 userInfo:{
//                     ...state?.userInfo,
//                     addressList:addresses
//                 }
//             }
//         },
//         removeAddress:(state,action)=>{
//             return {
//                 ...state,
//                 userInfo:{
//                     ...state?.userInfo,
//                     addressList: state?.userInfo?.addressList?.filter(address=> address?.id !== action?.payload)
//                 }
//             }
//         },
//         loadOrders: (state,action)=>{
//             return {
//                 ...state,
//                 orders:action?.payload
//             }
//         },
//         cancelOrder: (state,action)=>{
//             return {
//                 ...state,
//                 orders:state?.orders?.map(order=>{
//                     if(order?.id === action?.payload){
//                         return {
//                             ...order,
//                             orderStatus:'CANCELLED'
//                         }
//                     }
//                     return order;
//                 })
//             }
//         }
//     }
// });

// export const { loadUserInfo, saveAddress,updateAddress, removeAddress, loadOrders, cancelOrder } = userSlice?.actions;

// export const selectUserInfo = (state) => state?.userState?.userInfo ?? {};
// export const selectAllOrders = (state) => state?.userState?.orders ?? [];
// export const selectIsUserAdmin = (state) => state?.userState?.userInfo?.authorityList?.find((authority)=> authority?.roleCode === 'ADMIN')?.authority === 'ADMIN';
// export default userSlice?.reducer;

import { createSlice } from "@reduxjs/toolkit"

export const initialState = {
    userInfo: {},
    orders:[],
}

export const userSlice = createSlice({
    name:'userSlice',
    initialState,
    reducers:{
        loadUserInfo : (state,action)=>{
            return {
                ...state,
                userInfo:action?.payload
            }
        },
        saveAddress : (state,action)=>{
            const addresses = [...state?.userInfo?.addressList] ?? [];
            addresses.push(action?.payload);
            return {
                ...state,
                userInfo:{
                    ...state?.userInfo,
                    addressList:addresses
                }
            }
        },
        updateAddress : (state,action)=>{
            const updatedAddress = action?.payload;
            const addresses = [...state?.userInfo?.addressList] ?? [];
            
            const addressIndex = addresses.findIndex(address => address?.id === updatedAddress?.id);
            
            if (addressIndex !== -1) {
                addresses[addressIndex] = updatedAddress;
            } else {
                // Fallback: add if not found (shouldn't normally happen)
                addresses.push(updatedAddress);
            }
            
            return {
                ...state,
                userInfo:{
                    ...state?.userInfo,
                    addressList:addresses
                }
            }
        },
        // updateUserProfile : (state,action)=>{
        //     const addresses = [...state?.userInfo?.addressList] ?? [];
        //     addresses.push(action?.payload);
        //     return {
        //         ...state,
        //         userInfo:{
        //             ...state?.userInfo,
        //             addressList:addresses
        //         }
        //     }
        // },
        removeAddress:(state,action)=>{
            return {
                ...state,
                userInfo:{
                    ...state?.userInfo,
                    addressList: state?.userInfo?.addressList?.filter(address=> address?.id !== action?.payload)
                }
            }
        },
        loadOrders: (state,action)=>{
            return {
                ...state,
                orders:action?.payload
            }
        },
        cancelOrder: (state,action)=>{
            return {
                ...state,
                orders:state?.orders?.map(order=>{
                    if(order?.id === action?.payload){
                        return {
                            ...order,
                            orderStatus:'CANCELLED'
                        }
                    }
                    return order;
                })
            }
        },
        // Optional: Add a clear reducer for logout
        clearUserInfo: (state) => {
            return initialState;
        }
    }
});

export const { 
    loadUserInfo, 
    saveAddress, 
    updateAddress, 
    removeAddress, 
    loadOrders,
    // updateUserProfile, 
    cancelOrder,
    clearUserInfo 
} = userSlice?.actions;

export const selectUserInfo = (state) => state?.userState?.userInfo ?? {};
export const selectAllOrders = (state) => state?.userState?.orders ?? [];
export const selectIsUserAdmin = (state) => state?.userState?.userInfo?.authorityList?.find((authority)=> authority?.roleCode === 'ADMIN')?.authority === 'ADMIN';

export default userSlice?.reducer;