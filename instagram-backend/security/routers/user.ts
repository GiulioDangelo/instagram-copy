import "dotenv/config";
import express, {Request, Response, NextFunction, Router} from "express";
import signRouter from "./sign";
import {jwtAuthenticationMiddleware} from "../middleware/auth.middleware";
import {PrismaClient} from "@prisma/client";

const router: Router = express.Router();
const prisma = new PrismaClient();
router.use(signRouter);


// find all users with their posts and tags
router.get("/api/v1/users", jwtAuthenticationMiddleware, async (req: Request, resp: Response, next: NextFunction) => {
	const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  
	let foundUsers = await prisma.user.findMany({
	  take: limit,
	  select: {
		id: true,
		firstname: true,
		lastname: true,
		email: true,
		avatar: true,
		username: true,
		bio: true,
		createdAt: true,
		post: {
		  select: {
			postId: true,
			authorId: true,
			description: true,
			createdAt: true,
			likes: true,
			image: true,
			PostToTag: true,
		  },
		},
	  },
	});
  
	resp.status(200);
	resp.send(foundUsers);
  });



// find single user
router.get("/api/v1/users/:id",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
	
	let reqId = parseInt(req.params.id);
	console.log(reqId);
	
	if (isNaN(reqId) || reqId <= 0 ) {
		resp.status(400).send("Invalid user ID");
		return;
	}

	let foundSingleUser = await prisma.user.findUnique({
		where: {
			id: reqId,
		},
		include: {
			post: true,
		},
	});

	console.log(foundSingleUser, "utente trovato");

	resp.status(200);
	resp.send(foundSingleUser);
}
);



// edit single user
router.put("/api/v1/users/:id",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
	
	let reqId = parseInt(req.params.id);
	let userData = req.body;
	console.log(reqId);

	
	if (isNaN(reqId) || reqId <= 0 || reqId !== req.principal.id) {
		resp.status(400).send("Invalid user ID");
		return;
	}

	let editedUser = await prisma.user.update({
		where: {
			id: req.principal.id,
		},
		data: {
			username: userData.username,
			bio: userData.bio,
			avatar: userData.avatar,
		},
	});

	console.log(editedUser, "utente modificato");

	resp.status(200);
	resp.send(editedUser);
});



// delete single user
router.delete("/api/v1/users/:id",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
	
	let reqId = parseInt(req.params.id);
	console.log(reqId);
	
	if (isNaN(reqId) || reqId <= 0 || reqId !== req.principal.id) {
		resp.status(400).send("Invalid user ID");
		return;
	}

	let deletedUser = await prisma.user.delete({
		where: {
			id: req.principal.id,
		},
	});

	console.log(deletedUser, "utente cancellato");

	resp.status(204);
	resp.send(deletedUser);
});


export default router;