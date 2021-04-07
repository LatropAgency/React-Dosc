import {configureStore} from "@reduxjs/toolkit";
import accessTokenReducer from "../features/access_token/accessTokenSlice";
import userReducer from "../features/user/userSlice";

export default configureStore({
    reducer: {
        accessToken: accessTokenReducer,
        user: userReducer,
    },
});
