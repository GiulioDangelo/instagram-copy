import express, {Router, Request, Response} from "express";
import {sign} from "../service/jwt.service";
import {JwtPayloadId} from "../types/secutity";
import {PrismaClient} from "@prisma/client";

const router: Router = express.Router();

router.use(express.json());

const prisma = new PrismaClient();

// signin
router.put("/api/v1/login", async (req: Request, resp: Response) => {
	let userData = req.body;

	let foundUser: any = await prisma.user.findUnique({
		where: {
			email: userData.email,
			password: userData.password,
		},
	});

	console.log(foundUser, "trovato");

	if (!foundUser) {
		resp.status(400);
		resp.send({
			message: "dati errati o utente non registrato",
		});
		return;
	}

	const payload: JwtPayloadId = {
		id: foundUser.id,
		password: foundUser.password,
		username: foundUser.username,
		email: foundUser.email,
	};

	const token = sign(payload);

	resp.status(200);
	resp.send({
		token: token,
		foundUser,
	});
});



// signup
export default router;
router.post("/api/v1/signup", async (req: Request, resp: Response) => {
	let userData = req.body;

	let foundUser: any = await prisma.user.findUnique({
		where: {
			email: userData.email,
		},
	});

	if (foundUser) {
		resp.status(400);
		resp.send({
			message: "utente già registrato",
		});
	} else {
		let newUser = await prisma.user.create({
			data: {
				firstname: userData.firstname,
				lastname: userData.lastname,
				username: userData.username,
				email: userData.email,
				password: userData.password,
				avatar: userData.avatar,
			},
		});

		const payload: JwtPayloadId = newUser;
		const token = sign(payload);

		resp.status(200);
		resp.send({message: "utente registrato", newUser, token});
	}
});
