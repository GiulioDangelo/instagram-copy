import React from "react";
import {useState} from "react";
import "./Signup.css";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setToken} from "../../redux/authSlice";
import {setUser} from "../../redux/authSlice";
import {useNavigate} from "react-router-dom";

function Signup() {
	const [email, setEmail] = useState("");
	const [firstname, setFirstName] = useState("");
	const [lastname, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	function handleEmailChange(event) {
		setEmail(event.target.value);
	}

	function handleFirstnameChange(event) {
		setFirstName(event.target.value);
	}

	function handleLastnameChange(event) {
		setLastName(event.target.value);
	}

	function handleUsernameChange(event) {
		setUsername(event.target.value);
	}

	function handlePasswordChange(event) {
		setPassword(event.target.value);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (!email || !firstname || !lastname || !username || !password) {
			setError("Tutti i campi devono essere compilati.");
			return;
		}

		if (password.length < 4 || email.length < 4) {
			setError(
				"La password e l'email devono essere lunghe almeno 4 caratteri."
			);
			return;
		}

		axios
			.post("http://localhost:8080/api/v1/signup", {
				email: email,
				firstname: firstname,
				lastname: lastname,
				username: username,
				password: password,
			})
			.then((response) => {
				const token = response.data.token;
				const userData = response.data.newUser;

				dispatch(setToken(token));
				dispatch(setUser(userData));
				window.location.href = "/";
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}

	return (
		<>
			{error && <div className="alert alert-danger">{error}</div>}
			<div className="container-signup">
				<div className="container-form-singup d-flex flex-column">
					<div className="logo-container-signup">
						<img src="/assets/images/instagram-logo.png" />
					</div>
					<div className="text-container-signup text-center text-body-tertiary fs-5 fw-semibold">
						<p>Sign up to see photos and videos from your friends.</p>
					</div>
					<div className="button-container-signup">
						<button>
							<i className="fa-brands fa-square-facebook"></i> Log in with
							Facebook
						</button>
					</div>

					<div className="or-login">
						<div className="line-login"></div>
						<span>OR</span>
						<div className="line-login"></div>
					</div>

					<form
						onSubmit={handleSubmit}
						className="form-signup d-flex flex-column"
					>
						<input
							type="text"
							name="email"
							placeholder=" Email"
							onChange={handleEmailChange}
						/>
						<input
							type="text"
							name="firstname"
							placeholder=" Firstname"
							onChange={handleFirstnameChange}
						/>
						<input
							type="text"
							name="lastname"
							placeholder=" Lastname"
							onChange={handleLastnameChange}
						/>
						<input
							type="text"
							name="username"
							placeholder=" Username"
							onChange={handleUsernameChange}
						/>
						<input
							type="password"
							name="password"
							placeholder=" Password"
							onChange={handlePasswordChange}
						/>
						<button type="submit" className="button-submit-singup">
							Log In
						</button>
					</form>

					<div className="text-container-signup text-center text-body-tertiary fs-6 fw-semibold mt-4 mb-4 w-75">
						<p>
							By signing up, you agree to our Terms , Data Policy and Cookies
							Policy .
						</p>
					</div>
				</div>

				<div className="forgot-singup mt-3">
					Have an account?
					<a href="/login" className="link-signin fw-bold">
						{" "}
						Log In
					</a>
				</div>

				<div className="app-signin">
					Get the app.
					<div className="app-download-signin">
						<a href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D82759A18-FC9B-4C2C-A6C2-5A66AE40E54E%26utm_campaign%3DloginPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge%26original_referrer%3Dhttps%253A%252F%252Fwww.instagram.com%252F">
							<img
								src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
								alt="google-play"
								className="playstore-img-signin download"
							/>
						</a>

						<a href="ms-windows-store://pdp/?productid=9nblggh5l9xt&referrer=appbadge&source=www.instagram.com&mode=mini&pos=0%2C0%2C3200%2C1740">
							<img
								src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
								alt="microsoft-store"
								className="microsoft-img-signin download"
							/>
						</a>
					</div>
				</div>
			</div>
		</>
	);
}

export default Signup;
