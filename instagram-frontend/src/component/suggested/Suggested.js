import React from "react";
import {useState} from "react";
import "./Suggested.css";
import {faker} from "@faker-js/faker";

function Suggested() {
	let user = JSON.parse(localStorage.getItem("persist:auth"));
	user = JSON.parse(user.user);

	function generateFakeUser() {
		return {
			avatar: faker.image.avatarGitHub(),
			username: faker.internet.userName(),
			followedBy: faker.internet.userName(),
		};
	}

	const [suggestedUsers, setSuggestedUsers] = useState(() =>
		Array.from({length: 5}, generateFakeUser)
	);

	return (
		<>
			<div className="container-suggested">
				<div className="suggested-owner-profile">
					<a href={`/user/${user.id}`}>
						<div>
							<img className="suggested-avatar" src={user.avatar} />
							<span>{user.username}</span>
						</div>

						<button className="button-suggested">switch</button>
					</a>
				</div>

				<div className="suggested-title my-1">
					Suggested for you <span>See all</span>
				</div>

				<div className="suggested-users-profile d-flex flex-column">
					{suggestedUsers.map((fakeUser) => (
						<a href={`/WorkInProgress`}>
							<div className="d-flex">
								<img className="suggested-avatar" src={fakeUser.avatar} />

								<div className="d-flex flex-column">
									<span>{fakeUser.username}</span>
									<span className="text-secondary">
										Followed by {fakeUser.followedBy}
									</span>
								</div>
							</div>

							<button className="button-suggested">Follow</button>
						</a>
					))}
				</div>

				<div className="suggested-footer">
					<div className="suggested-footer-list">
						About · Help · Press · API · Jobs · Privacy · Terms · Locations ·
						Language · Meta Verified
					</div>

					<div>© 2023 INSTAGRAM FROM META</div>
				</div>
			</div>
		</>
	);
}

export default Suggested;
