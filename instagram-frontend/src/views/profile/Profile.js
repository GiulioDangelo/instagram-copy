import React from "react";
import axios from "axios";
import {useState, useEffect} from "react";
import Aside from "../../component/aside/Aside";
import {useParams} from "react-router-dom";

function Profile() {
	require("./Profile.css");

	let token = JSON.parse(localStorage.getItem("persist:auth"));
	token = JSON.parse(token.token);

	let user = JSON.parse(localStorage.getItem("persist:auth"));
	user = JSON.parse(user.user);

	const [userData, setUserData] = useState({});
	const [errorMsg, setErrorMsg] = useState("");
	const profileParam = useParams();

	useEffect(() => {
		axios
			.get(`http://localhost:8080/api/v1/users/${profileParam.userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setUserData(response.data);
			})
			.catch((error) => {
				console.log(error.response.data);
				setErrorMsg(error.response.data.message);
			});
	}, [token]);

	return (
		<div className="container-profile">
			<Aside />
			{errorMsg && <p className="text-danger">{errorMsg}</p>}

			<div className="user-info">
				<div className="avatar-profile p-4 me-5">
					<img src={userData.avatar} />
				</div>

				<div className="user-data">
					<div className="d-flex align-items-center">
						<h4>{userData.username}</h4>

						{parseInt(user.id) === parseInt(profileParam.userId) && (
							<a href={`/user/${userData.id}/edit`}>
								<button className="edit-profile btn edit-btn-profile">
									Edit Profile
								</button>
							</a>
						)}

						{parseInt(user.id) !== parseInt(profileParam.userId) && (
							<div>
								<a href={`/workInProgress`}>
									<button className="edit-profile btn edit-btn-profile">
										Following
										<i className="fas fa-check ms-2"></i>
									</button>
								</a>

								<a href={`/workInProgress`}>
									<button className="edit-profile btn edit-btn-profile">
										Message
									</button>
								</a>

								<i className="fas fa-ellipsis-h ms-4"></i>
							</div>
						)}
					</div>

					<div className="d-flex my-3">
						<div>{userData.post?.length ?? 0} post</div>
						<div className="px-5">{userData.followers} followers</div>
						<div>{userData.following} following</div>
					</div>

					<div className="user-bio">
						<span>{userData.bio}</span>
					</div>
				</div>
			</div>

			<ul className="list-section-profile d-flex justify-content-center">
				<li>
					<i className="fas fa-th"></i>
					POSTS
				</li>
				<li>
					<i className="fa-solid fa-clapperboard"></i>
					REELS
				</li>
				<li>
					<i className="fa-solid fa-user-tag"></i>
					TAGGED
				</li>
			</ul>

			<div className="user-posts">
				{userData.post &&
					userData.post.map((post) => {
						return (
							<>
								<div key={post.id} className="post-profile">
									<a href={`/users/${user.id}/posts/${post.postId}`}>
										<img src={post.image} />
									</a>
								</div>
							</>
						);
					})}
			</div>
		</div>
	);
}

export default Profile;
