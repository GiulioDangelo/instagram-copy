import React, {useState, useEffect} from "react";
import axios from "axios";
import Aside from "../../component/aside/Aside";
import Card from "../../component/card/Card";
import {useInView} from "react-intersection-observer";
import Stories from "../../component/stories/Stories";
import "./Home.css";
import Suggested from "../../component/suggested/Suggested";

function Home() {
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

			<div className="container-home d-flex flex-column justify-content-center align-items-center">
				<div>
					<div className="options-story-home mb-3">
						<span className="fw-bold ms-3 me-3 mb-2">For You</span>
						<span>Following</span>
					</div>

					<div className="stories-container-home">
						<Stories />
					</div>
				</div>

				<Suggested />

				<div className="card-container-home">
					{posts.map((post) => (
						<Card post={post} key={post.postId} />
					))}
				</div>

				<div ref={ref}>You're all caught up!✔️</div>
			</div>
		</>
	);
}

export default Home;
