import React, {useEffect} from "react";
import axios from "axios";
import {useState} from "react";
import {useParams} from "react-router-dom";
import Card from "../../component/card/Card";
import Aside from "../../component/aside/Aside";

function PostDetail() {
	let params = useParams();

	let token = JSON.parse(localStorage.getItem("persist:auth"));
	token = JSON.parse(token.token);

	let user = JSON.parse(localStorage.getItem("persist:auth"));
	user = JSON.parse(user.user);

	const [post, setPost] = useState("");

	useEffect(() => {
		axios
			.get(
				`http://localhost:8080/api/v1/users/${params.userId}/posts/${params.postId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				setPost(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<>
			<Aside />

			<div className="d-flex flex-column justify-content-center align-items-center mt-5">
				{post && <Card post={post} />}

				<div className="d-flex">
					{user.id == params.userId ? (
						<a
							href={`http://localhost:3000/users/${params.userId}/posts/${params.postId}/edit`}
						>
							<button className="btn btn-primary">Edit</button>
						</a>
					) : null}
					<a href="/">
						<button className="btn btn-primary ms-2">Go To Home</button>
					</a>
				</div>
			</div>
		</>
	);
}

export default PostDetail;
