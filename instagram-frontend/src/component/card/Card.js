import React from "react";
import "./Card.css";

function Card({post}) {
	const hastag = post.PostToTag;
	let token = JSON.parse(localStorage.getItem("persist:auth"));
	token = JSON.parse(token.token);

	return (
		<div className="card-container-card" key={post.id}>
			<div className="header-card d-flex align-items-center justify-content-between">
				<div className="d-flex align-items-center">
					<div className="avatar-card">
						<img
							src={
								post.author.avatar ||
								"https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_960_720.png"
							}
							alt="avatar"
						/>
					</div>

					<div className="username-card">
						<a href={`/user/${post.authorId}`}>{post.author.username}</a>
					</div>

					<div className="createdAt-card">
						<span>{post.createdAt.slice(0, 10)}</span>
					</div>
				</div>

				<div className="username-card">
					<i className="fa-solid fa-ellipsis"></i>
				</div>
			</div>

			<div className="body-card w-100">
				<div className="card-image-card">
					<a href={`http://localhost:3000/users/${post.authorId}/posts/${post.postId}`}>
						<img src={post.image} alt="post" />
					</a>
				</div>

				<div className="interact-card d-flex justify-content-between fs-3">
					<div className="interact-left-card">
						<span>
							<i className="fa-regular fa-heart me-2"></i>
						</span>
						<span>
							<i className="fa-regular fa-comment me-2"></i>
						</span>
						<span>
							<i className="fa-regular fa-paper-plane me-2"></i>
						</span>
					</div>

					<span>
						<i className="fa-regular fa-bookmark"></i>
					</span>
				</div>
			</div>

			<div className="footer-card">
				<div className="likes-card my-1">
					<span className="">
						Liked by <span className="fw-bold">{post.likes}</span> user
					</span>
				</div>

				<div className="my-2">
					<a href={`/user/${post.authorId}`} className="fw-bold">
						{post.author.username}
					</a>
					<span className="ms-2">{post.description}</span>
				</div>
				<div>
					{hastag.map((tag) => (
						<a
							href={`/workInProgress`}
							className="me-2 hashtag-card"
							key={tag.tag.tagId}
						>
							{tag.tag.name}
						</a>
					))}
				</div>
				<div className="comments-card">
					<span className="text-muted">View all {post.comments} comments</span>
					<div className="mt-1 text-muted d-flex justify-content-between">
						Add a comment... <i className="fa-regular fa-face-smile"></i>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Card;
