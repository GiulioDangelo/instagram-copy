import React, {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Provider} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";


import Home from "./views/home/Home";
import Signup from "./views/signup/Signup";
import Login from "./views/login/Login";
import Explore from "./views/explore/Explore";
import Profile from "./views/profile/Profile";
import PostCreate from "./views/postCreate/PostCreate";
// import SearchTag from "./views/searchTag/SearchTag";
import PostEdit from "./views/postEdit/PostEdit";
import PostDetail from "./views/postDetail/PostDetail";
import UserEdit from "./views/userEdit/UserEdit";


function App() {

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/login"element={<Login/>}/>
						<Route path="/explore" element={<Explore />} />
						<Route path="/user/:userId" element={<Profile />} />
						<Route path="/user/:userId/edit" element={<UserEdit/>} />
						<Route path="post/create" element={<PostCreate/>} />
						<Route path="users/:userId/posts/:postId/edit" element={<PostEdit/>} />
						<Route path="users/:userId/posts/:postId" element={<PostDetail/>} />
						<Route path="/workInProgress" element={<h1>Work In Progress...</h1>} />
						<Route path="*" element={<h1>404</h1>} />
					</Routes>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	);
}

export default App;
