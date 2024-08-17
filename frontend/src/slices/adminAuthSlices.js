import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminInfo: (() => {
        try {
            const storedInfo = localStorage.getItem('adminInfo');
            return storedInfo ? JSON.parse(storedInfo) : null;
        } catch (error) {
            console.error('Error parsing localStorage data', error);
            return null;
        }
    })(),
};

const adminAuthSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdminCredentials: (state, action) => {
            state.adminInfo = action.payload;
            localStorage.setItem('adminInfo', JSON.stringify(action.payload));
        },
        adminLogout: (state) => {
            state.adminInfo = null;
            localStorage.removeItem('adminInfo');
        },
    },
});

export const { setAdminCredentials, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
