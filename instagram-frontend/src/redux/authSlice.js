import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: null,
		user: null,
	},
	reducers: {
		setToken: (state, action) => {
			state.token = action.payload;
		},
		setUser: (state, action) => {
			state.user = action.payload;
		},
		removeToken: (state) => {
			state.token = null;
			state.user = null;
			window.localStorage.removeItem("persist:auth");
		},
	},
});

export const {setToken, setUser, removeToken} = authSlice.actions;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
