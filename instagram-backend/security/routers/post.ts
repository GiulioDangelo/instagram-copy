import "dotenv/config";
import express, {Request, Response, NextFunction, Router} from "express";
import signRouter from "./sign";
import {jwtAuthenticationMiddleware} from "../middleware/auth.middleware";
import {PrismaClient} from "@prisma/client";


const router: Router = express.Router();
const prisma = new PrismaClient();
router.use(signRouter);



// find all posts
router.get("/api/v1/posts",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
    const offset = parseInt(req.query.offset as string, 10) || 0;
	console.log(offset);
	

		let foundPosts = await prisma.post.findMany({
			include: {
				PostToTag: {
					select: {
						tag: true,
					},
				},
				author: true,
			},
			take: 21,
			skip: offset,
		});

		resp.status(200);
		resp.send(foundPosts);
	}
);



// find single post
router.get("/api/v1/posts/:postId",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
		let reqId = parseInt(req.params.postId);
		console.log(reqId);

		if (isNaN(reqId) || reqId <= 0) {
			resp.status(400).send("Invalid user ID");
			return;
		}

		let foundSinglePost = await prisma.post.findUnique({
			where: {
				postId: reqId,
			},
			include: {
				PostToTag: {
					select: {
						tag: true,
					},
				},
			},
		});

		console.log(foundSinglePost, "post trovato");

		resp.status(200);
		resp.send(foundSinglePost);
	}
);



// find single user posts
router.get("/api/v1/users/:id/posts",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {

	let reqId = parseInt(req.params.id);
	console.log(reqId);

	if (isNaN(reqId) || reqId <= 0 || reqId !== req.principal.id) {
		resp.status(400).send("Invalid user ID");
		return;
	}

	let foundUserPosts = await prisma.post.findMany({
		where: {
			authorId: req.principal.id,
		},
		include: {
			PostToTag: {
				select: {
					tag: true,
				},
			},
		},
	});
	console.log(foundUserPosts, "trovato");
	resp.send(foundUserPosts);
}
);



//find single user single post
router.get("/api/v1/users/:id/posts/:postId",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
	let reqId = parseInt(req.params.id);
	let postId = parseInt(req.params.postId);

	if (isNaN(reqId) || reqId <= 0) {
		resp.status(400).send("Invalid user ID");
		return;
	}

	if (isNaN(postId) || postId <= 0) {
		resp.status(400).send("Invalid post ID");
		return;
	}

	let foundSingleUserPost = await prisma.post.findUnique({
		where: {
			postId: postId,
		},
		include: {
			PostToTag: {
				select: {
					tag: true,
				},
			},
			author: true,
		},
	});

	resp.status(200);
	resp.send(foundSingleUserPost);
});




// create single user post
router.post("/api/v1/users/:id/posts",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
		
		let reqId = parseInt(req.params.id);
		console.log(reqId);

		if (isNaN(reqId) || reqId <= 0|| reqId !== req.principal.id) {
			resp.status(400).send("Invalid user ID");
			return;
		}

		let createdPost = await prisma.post.create({
			data: {
				description: req.body.description,
				image: req.body.image,
				authorId: req.principal.id,
			},
		});

		console.log(createdPost, "post creato");

		resp.status(200);
		resp.send(createdPost);
	}
);



// edit single post
router.put("/api/v1/users/:id/posts/:postId",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
		
		let reqId = parseInt(req.params.id);
		let postId = parseInt(req.params.postId);
		console.log(reqId);

		if (isNaN(reqId) || reqId <= 0|| reqId !== req.principal.id) {
			resp.status(400).send("Invalid user ID");
			return;
		}

		if (isNaN(postId) || postId <= 0) {
			resp.status(400).send("Invalid post ID");
			return;
		}

		const editedPost = await prisma.post.update({
			where: {
			  postId: postId,
			  authorId: req.principal.id,
			},
			data: {
			  description: req.body.description,
			  image: req.body.image,
			},
		  });


		resp.status(200);
		resp.send(editedPost);
	}
);



// delete single post
router.delete("/api/v1/users/:id/posts/:postId",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
		
		let reqId = parseInt(req.params.id);
		let postId = parseInt(req.params.postId);
		console.log(reqId);

		if (isNaN(reqId) || reqId <= 0|| reqId !== req.principal.id) {
			resp.status(400).send("Invalid user ID");
			return;
		}

		if (isNaN(postId) || postId <= 0) {
			resp.status(400).send("Invalid post ID");
			return;
		}

		let deletedPost = await prisma.post.delete({
			where: {
				postId: postId,
				authorId: req.principal.id
			},
			include: {
				PostToTag: {
					select: {
						tag: true,
					},
				},
			}
		});

		
		console.log(deletedPost, "post cancellato");

		resp.status(200);
		resp.send(deletedPost);
	}
);

export default router;