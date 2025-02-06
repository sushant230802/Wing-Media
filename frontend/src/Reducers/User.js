import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            // state.isAuthenticated = true;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // state.isAuthenticated = false;
        },

        registerRequest: (state) => {
            state.loading = true;
        },
        registerSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            // state.isAuthenticated = true;
        },
        registerFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // state.isAuthenticated = false;
        },

        loadUserRequest: (state) => {
            state.loading = true;
        },
        loadUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            // state.isAuthenticated = true;
        },
        loadUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // state.isAuthenticated = false;
        },
    },
});

// // Exporting actions for dispatching in components
// export const {
//     loginRequest,
//     loginSuccess,
//     loginFailure,
//     registerRequest,
//     registerSuccess,
//     registerFailure,
//     loadUserRequest,
//     loadUserSuccess,
//     loadUserFailure,
// } = userSlice.actions;

// Export the reducer to use in the store
export default userSlice.reducer;
