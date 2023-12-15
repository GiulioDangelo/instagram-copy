import React, {useState} from "react";
import "./Login.css";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setToken} from "../../redux/authSlice";
import {setUser} from "../../redux/authSlice";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const dispatch = useDispatch();

	function handleEmailChange(event) {
		setEmail(event.target.value);
	}

	function handlePasswordChange(event) {
		setPassword(event.target.value);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (!email || !password) {
			setError("Email e password sono campi obbligatori.");
			return;
		}

		if (password.length < 4 || email.length < 4) {
			setError(
				"La password e l'email devono essere lunghe almeno 4 caratteri."
			);
			return;
		}

		axios
			.put("http://localhost:8080/api/v1/login", {
				email: email,
				password: password,
			})
			.then((response) => {
				const token = response.data.token;
				const user = response.data.foundUser;

				console.log(token, user);

				dispatch(setToken(token));
				dispatch(setUser(user));

				window.location.href = "/";
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}

	return (
		<div className="container-login">
			{error && <div className="alert alert-danger">{error}</div>}
			<div className="card-login">
				<div className="logo-login">
					<a href="/login">
						<img
							src="assets/images/instagram-logo.png"
							className="logo-login"
							alt="logo"
						/>
					</a>
				</div>
				<form className="form-login" onSubmit={handleSubmit}>
					<input
						type="text"
						name=" Email"
						value={email}
						placeholder=" Email"
						className="input-email"
						onChange={handleEmailChange}
					/>

					<input
						type="password"
						name="password"
						value={password}
						placeholder=" Password"
						className="input-password"
						onChange={handlePasswordChange}
					/>

					<button type="submit" value="Submit" className="submit-login">
						Log in
					</button>
				</form>

				<div className="or-login">
					<div className="line-login"></div>
					<span>OR</span>
					<div className="line-login"></div>
				</div>

				<div className="facebook-login">
					<a href="/login">
						<i className="fa-brands fa-square-facebook"></i>
						<span>Log in with Facebook</span>
					</a>
				</div>

				<div className="forgot-login mt-3">
					<a href="/signin">Forgotten password?</a>
				</div>

				<div className="report-login">
					You can also report content that you believe is unlawful in your
					country without logging in.
				</div>
			</div>

			<div className="link-signup-login">
				<span>Don't have an account? </span>
				<a href="/signup">Sign up</a>
			</div>

			<div className="app-login">
				Get the app.
				<div className="app-download-login">
					<a href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D82759A18-FC9B-4C2C-A6C2-5A66AE40E54E%26utm_campaign%3DloginPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge%26original_referrer%3Dhttps%253A%252F%252Fwww.instagram.com%252F">
						<img
							src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
							alt="google-play"
							className="playstore-img-login download"
						/>
					</a>

					<a href="ms-windows-store://pdp/?productid=9nblggh5l9xt&referrer=appbadge&source=www.instagram.com&mode=mini&pos=0%2C0%2C3200%2C1740">
						<img
							src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
							alt="microsoft-store"
							className="microsoft-img-login download"
						/>
					</a>
				</div>
			</div>
		</div>
	);
}

export default Login;
