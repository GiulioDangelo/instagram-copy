import React, {useEffect} from "react";
import axios from "axios";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import Modal from "../../component/modal/Modal";
import "./PostEdit.css";

function PostEdit() {
	let params = useParams();

	let token = JSON.parse(localStorage.getItem("persist:auth"));
	token = JSON.parse(token.token);

	let user = JSON.parse(localStorage.getItem("persist:auth"));
	user = JSON.parse(user.user);

	let [oldPost, setOldPost] = useState({});

	const [image, setImage] = useState(oldPost.image);
	const [description, setDescription] = useState(oldPost.description);

	const [hashtag, setHashtag] = useState("");
	const [hashtagArr, setHashtagArr] = useState([]);

	const [error, setError] = useState("");

	let navigate = useNavigate();

	
	// get post data
	useEffect(() => {
		axios
			.get(`http://localhost:8080/api/v1/posts/${params.postId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setOldPost(response.data);
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}, []);


	function handleimageChange(e) {
		setImage(e.target.value);
	}

	function handleDescriptionChange(e) {
		setDescription(e.target.value);
	}

	// add hashtag to inputValue
	function handleHashtagChange(event) {
		const inputValue = event.target.value;

		if (!inputValue.startsWith("#")) {
			setHashtag("#" + inputValue);
		} else {
			setHashtag(inputValue);
		}
	}



	// edit post and save it in oldPost
	function editPost() {
		axios
			.put(
				`http://localhost:8080/api/v1/users/${params.userId}/posts/${params.postId}`,
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
				setOldPost(response.data);
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}



	// add hashtag to hashtagArr with name, the id is given by the backend on form submit
	function addHashtag(event) {
		event.preventDefault();

		const trimmedHashtag = hashtag.trim();
		if (!trimmedHashtag || trimmedHashtag === "#") {
			setError("Il campo del tag non può essere vuoto o contenere solo '#'.");
			return;
		}

		setHashtagArr([...hashtagArr, {name: hashtag}]);

		setHashtag("");
		setError(null);
	}



	// create an hashtag for each hashtag in hashtagArr
	async function createHashtag(postId) {
		try {
			const hashtagRequests = hashtagArr.map((hashtagObj) =>
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
		} catch (error) {
			setError(error.response.data.message);
		}
	}



	// remove hashtag from hashtagArr (on <li> click) and from the backend,then reload the page to show the updated list
	function removeHashtag(tagId) {
		axios
			.delete(
				`http://localhost:8080/api/v1/posts/${params.postId}/tags/${tagId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				console.log(response);

				const updatedHashtagArr = hashtagArr.filter(
					(hashtagObj) => hashtagObj.name !== response.data.name
				);
				setHashtagArr(updatedHashtagArr);
				window.location.reload(true);
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}



	// on form submit, edit post and create hashtag
	function handleSubmit(e) {
		e.preventDefault();
		editPost(e);
		createHashtag(params.postId);
		window.location.pathname = `/users/${params.userId}/posts/${params.postId}`;
	}



	// delete post
	function deletePost() {
		axios
			.delete(
				`http://localhost:8080/api/v1/users/${params.userId}/posts/${params.postId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				navigate(`http://localhost:8080/user/${params.userId}`);
			})
			.catch((error) => {
				setError(error.response.data.message);
			});
	}

	return (
		<>
			{error && <div className="alert alert-danger">{error}</div>}

			<form className="form-postEdit col-6 m-auto" onSubmit={handleSubmit}>
				<div className="text-center">
					<h1>Post Edit</h1>
				</div>
				<div className="form-row d-flex justify-content-center flex-column align-items-center w-100">
					<div className="form-group w-100">
						<label className="mb-2 mt-3">Image url</label>
						<input
							type="text"
							className="form-control"
							name="image"
							placeholder={oldPost.image}
							onChange={handleimageChange}
						/>
					</div>
					<div className="form-group w-100">
						<label className="mb-2 mt-3">description</label>
						<input
							type="text"
							className="form-control"
							name="description"
							placeholder={oldPost.description}
							onChange={handleDescriptionChange}
						/>
					</div>

					<div className="form-group w-100 mb-3">
						<label className="mb-2 mt-3">Hashtag</label>
						<div className="d-flex align-items-center mb-2">
							<input
								type="text"
								className="form-control w-75"
								name="hashtag"
								placeholder="Hashtag"
								value={hashtag}
								onChange={handleHashtagChange}
							/>

							<button
								className="btn btn-primary text-light ms-4"
								onClick={addHashtag}
							>
								Add Hashtag
							</button>
						</div>

						<ul className="d-flex list-none ps-0">
							{hashtagArr.map((hashtag, index) => (
								<li
									className="me-3 list-group-item list-group-item-info mt-2 hashtag-list-postEdit"
									key={index}
									onClick={() => {
										const updatedHashtagArr = [...hashtagArr];
										updatedHashtagArr.splice(index, 1);
										setHashtagArr(updatedHashtagArr);
									}}
								>
									{hashtag.name}
								</li>
							))}

							{oldPost.PostToTag &&
								oldPost.PostToTag.map((tag) => (
									<li
										className="me-3 list-group-item list-group-item-info mt-2 hashtag-list-postEdit"
										onClick={() => removeHashtag(tag.tag.tagId)}
										key={tag.tag.tagId}
									>
										{tag.tag.name}
									</li>
								))}
						</ul>
					</div>
				</div>

				<div className="w-100">
					<button
						type="submit"
						className="submit-postCreate btn btn-primary mt-0 me-2"
					>
						Edit Post
					</button>
					<Modal deleteItem={deletePost} item={"post"} />
				</div>
			</form>
		</>
	);
}

export default PostEdit;
