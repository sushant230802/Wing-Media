import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Reducers/User"; // Import userSlice reducer

const store = configureStore({
    reducer: {
        user: userReducer, // Adding user reducer
    },
});

export default store;
