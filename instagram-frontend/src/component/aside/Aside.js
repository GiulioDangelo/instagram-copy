import React from "react";
import "./Aside.css";
import {removeToken} from "../../redux/authSlice";
import {useDispatch} from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";

function Aside() {
	let userData = JSON.parse(localStorage.getItem("persist:auth"));
	userData = JSON.parse(userData.user);
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(removeToken());
	};

	return (
		<div className="container-aside">
			<div>
				<div className="logo-aside">
					<a href="/">
						<img
							src="/assets/images/instagram-logo.png"
							className="logo-aside"
							alt="logo"
						/>

						<i className="fa-brands fa-instagram logo-icon-aside"></i>
					</a>
				</div>

				<ul className="aside-list">
					<li>
						<a href="/">
							<i className="fa-solid fa-house"></i>
							<span className="list-text-aside">Home</span>
						</a>
					</li>
					<li>
						<a href="/workInProgress">
							<i className="fa-solid fa-search"></i>
							<span className="list-text-aside">Search</span>
						</a>
					</li>
					<li>
						<a href="/explore">
							<i className="fa-regular fa-compass"></i>
							<span className="list-text-aside">Explore</span>
						</a>
					</li>
					<li>
						<a href="/workInProgress">
							<i className="fa-solid fa-clapperboard"></i>
							<span className="list-text-aside">Reels</span>
						</a>
					</li>
					<li>
						<a href="/workInProgress">
							<i className="fa-solid fa-paper-plane"></i>
							<span className="list-text-aside">Messages</span>
						</a>
					</li>
					<li>
						<a href="/workInProgress">
							<i className="fa-regular fa-heart"></i>
							<span className="list-text-aside">Notifications</span>
						</a>
					</li>
					<li>
						<a href="/post/create">
							<i className="fa-regular fa-square-plus"></i>
							<span className="list-text-aside">Create</span>
						</a>
					</li>
					<li>
						<a href={`/user/${userData.id}`}>
							<img src={userData.avatar} className="avatar-aside me-2" />
							<span className="list-text-aside">Profile</span>
						</a>
					</li>
				</ul>
			</div>

			<div className="footer-aside d-flex flex-column">
				<a href="/login" onClick={handleLogout}>
					<i className="fa-solid fa-right-from-bracket"></i>
					<span className="list-text-aside">Logout</span>
				</a>

				<Dropdown drop={"up"}>
					<Dropdown.Toggle>
						<a>
							<i className="fa-solid fa-bars"></i>
							<span className="list-text-aside">More</span>
						</a>
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item href={`/user/${userData.id}/edit`}>
							Edit Profile
						</Dropdown.Item>
						<Dropdown.Item href="/workInProgress">Another action</Dropdown.Item>
						<Dropdown.Item href="/workInProgress">Something else</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div>
	);
}

export default Aside;
