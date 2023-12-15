import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./PostCreate.css";

function PostCreate() {
	const [image, setImage] = useState("");
	const [description, setDescription] = useState("");

	const [hashtag, setHashtag] = useState("");
	const [hastagArr, setHastagArr] = useState([]);

	const [error, setError] = useState("");

	let user = JSON.parse(localStorage.getItem("persist:auth"));
	user = JSON.parse(user.user);

	let token = JSON.parse(localStorage.getItem("persist:auth"));
	token = JSON.parse(token.token);

	const navigate = useNavigate();

	function handleDescriptionChange(event) {
		setDescription(event.target.value);
	}

	function handleImageChange(event) {
		setImage(event.target.value);
	}

	function handleHashtagChange(event) {
		const inputValue = event.target.value;

		if (!inputValue.startsWith("#")) {
			setHashtag("#" + inputValue);
		} else {
			setHashtag(inputValue);
		}
	}



	// create post and call createHashtag
	function createPost() {
		axios
			.post(
				`http://localhost:8080/api/v1/users/${user.id}/posts`,
				{
					image: image,
					description: description,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				const postId = response.data.postId;

				if (postId) {
					createHashtag(postId);
				} else {
					console.error("Post ID is undefined");
				}
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}



	function addHastag(event) {
		event.preventDefault();

		const trimmedHashtag = hashtag.trim();
		if (!trimmedHashtag || trimmedHashtag === "#") {
			setError("Il campo del tag non può essere vuoto o contenere solo '#'.");
			return;
		}

		setHastagArr([...hastagArr, {name: hashtag}]);
		setHashtag("");
		setError(null);
	}



	// create hashtag
	async function createHashtag(postId) {
		try {
			const hashtagRequests = hastagArr.map((hashtagObj) =>
				axios.post(
					`http://localhost:8080/api/v1/posts/${postId}/tags`,
					{
						name: hashtagObj.name,
						postId: postId,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
			);

			await Promise.all(hashtagRequests);

			navigate(`/user/${user.id}`);
		} catch (error) {
			setError(error.response.data.message);
		}
	}


	
	// create post and hashtag
	function handleSubmit(event) {
		event.preventDefault();
		createPost();
	}

	return (
		<>
			{error && <div className="alert alert-danger">{error}</div>}

			<div className="container-postCreate">
				<h1 className="text-center pt-5">Create Post</h1>
				<form className="form-postCreate w-100" onSubmit={handleSubmit}>
					<div className="form-row d-flex justify-content-center flex-column align-items-center w-100">
						<div className="form-group w-100">
							<input
								type="text"
								className="form-control"
								name="image"
								placeholder="Image url"
								onChange={handleImageChange}
							/>
						</div>
						<div className="form-group w-100">
							<input
								type="text"
								className="form-control"
								name="description"
								placeholder="description"
								onChange={handleDescriptionChange}
							/>
						</div>
						<div className="form-group w-100 d-flex align-items-center justify-content-center hashtag-group-postCreate">
							<input
								type="text"
								className="form-control"
								name="hashtag"
								placeholder="hashtag"
								value={hashtag}
								onChange={handleHashtagChange}
							/>

							<button className="btn btn-primary" onClick={addHastag}>
								Add Hashtag
							</button>
						</div>
						<ul className="d-flex list-none ps-0">
							{hastagArr.map((hastag) => (
								<li
									className="me-3 list-group-item list-group-item-info"
									key={hastag.tagId}
								>
									{hastag.name}
								</li>
							))}
						</ul>
					</div>
					<button
						type="submit"
						className="submit-postCreate btn btn-primary mb-4"
					>
						Create Post
					</button>
				</form>
			</div>
		</>
	);
}

export default PostCreate;
