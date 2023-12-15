import React from "react";
import "./Stories.css";
import axios from "axios";
import {useState, useEffect} from "react";
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";

function Stories() {
	let token = JSON.parse(localStorage.getItem("persist:auth"));
	token = JSON.parse(token.token);

	const [users, setUsers] = useState([]);

	useEffect(() => {
		axios
			.get("http://localhost:8080/api/v1/users?limit=15", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setUsers(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<>
			<Flicking
				align="prev"
				circular="true"
				panelsPerView="5"
				preventClickOnDrag="true"
			>
				{users.map((user) => (
					<div key={user.username} className="container-story">
						<div className="gradient">
							<a href={`/user/${user.id}`}>
								<img
									className="avatar-stories"
									src={user.avatar}
									alt={`Avatar of ${user.username}`}
								/>
							</a>
						</div>
						<span>{user.username}</span>
					</div>
				))}
			</Flicking>
		</>
	);
}

export default Stories;
