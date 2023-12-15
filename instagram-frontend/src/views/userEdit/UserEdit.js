import React from "react";
import axios from "axios";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Modale from "../../component/modal/Modal";
import "./UserEdit.css";

function UserEdit() {
	let params = useParams();

	let token = JSON.parse(localStorage.getItem("persist:auth"));
	token = JSON.parse(token.token);

	let [oldUser, setOldUser] = useState({});

	const [avatar, setAvatar] = useState(oldUser.avatar);
	const [bio, setBio] = useState(oldUser.bio);

	const [error, setError] = useState("");

	let navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`http://localhost:8080/api/v1/users/${params.userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setOldUser(response.data);
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}, []);

	function handleAvatarChange(e) {
		setAvatar(e.target.value);
	}

	function handleDescriptionChange(e) {
		setBio(e.target.value);
	}

	function editUser() {
		axios
			.put(
				`http://localhost:8080/api/v1/users/${params.userId}`,
				{
					avatar: avatar,
					bio: bio,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				setOldUser(response.data);
				navigate(`/user/${oldUser.id}}`);
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}

	function handleSubmit(e) {
		e.preventDefault();
		editUser(e);
	}

	function deleteUser() {
		axios
			.delete(`http://localhost:8080/api/v1/users/${params.userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				localStorage.removeItem("persist:auth");
				navigate(`/signin`);
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}

	return (
		<>
			<form className="form-UserEdit" onSubmit={handleSubmit}>
				<div className="text-center">
					<h1>User Edit</h1>
				</div>
				<div className="form-row d-flex justify-content-center flex-column align-items-center w-100">
					<div className="form-group w-100">
						<label>Avatar url</label>
						<input
							type="text"
							className="form-control my-2"
							name="avatar"
							placeholder={oldUser.avatar}
							onChange={handleAvatarChange}
						/>
					</div>
					<div className="form-group w-100">
						<label className="mt-3">Bio</label>
						<input
							type="text"
							className="form-control my-2"
							name="bio"
							placeholder={oldUser.bio}
							onChange={handleDescriptionChange}
						/>
					</div>
				</div>

				<div className="mt-2">
					<button
						type="submit"
						className="submit-UserEdit btn btn-primary me-2"
					>
						Edit Profile
					</button>
					<Modale deleteItem={deleteUser} item={"Account"} />
				</div>
			</form>
		</>
	);
}

export default UserEdit;
