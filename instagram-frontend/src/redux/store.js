// redux/store.js
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import {configureStore} from "@reduxjs/toolkit";

const persistConfig = {
	key: "auth",
	storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
	reducer: persistedReducer,
});

const persistor = persistStore(store);

export {store, persistor};
