import React from "react";
import "./Explore.css";
import axios from "axios";
import {useState, useEffect} from "react";
import Aside from "../../component/aside/Aside";
import {useInView} from "react-intersection-observer";

function Explore() {
	let token = JSON.parse(localStorage.getItem("persist:auth"));
	token = JSON.parse(token.token);

	const {ref, inView, entry} = useInView({});

	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(21);

	useEffect(() => {
		axios
			.get("http://localhost:8080/api/v1/posts", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setPosts(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [token]);

	const loadMorePosts = () => {
		const nextPage = currentPage + 21;

		axios
			.get(`http://localhost:8080/api/v1/posts?offset=${nextPage}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setPosts([...posts, ...response.data]);
				setCurrentPage(nextPage);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		if (inView) {
			loadMorePosts();
		}
	}, [inView]);

	return (
		<>
			<Aside />

			<div className="container-explore">
				<h1 className="text-center">Explore</h1>
				<div className="card-container">
					{posts.map((post) => (
						<div
							key={post.id}
							className="col-12 col-sm-6 col-md-4 image-container-explore p-1"
						>
							<a href={`users/${post.authorId}/posts/${post.postId}`}>
								<img src={post.image} />
							</a>
						</div>
					))}
				</div>

				<div ref={ref}>You're all caught up!✔️</div>
			</div>
		</>
	);
}

export default Explore;
