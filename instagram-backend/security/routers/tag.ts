import "dotenv/config";
import express, {Request, Response, NextFunction, Router} from "express";
import signRouter from "./sign";
import {jwtAuthenticationMiddleware} from "../middleware/auth.middleware";
import {PrismaClient, Tag} from "@prisma/client";
import checkTagExistence from "../middleware/checkTagExistence.middleware";


const router: Router = express.Router();
const prisma = new PrismaClient();
router.use(signRouter);



// get all hastags
router.get("/api/v1/tags",jwtAuthenticationMiddleware,checkTagExistence,async (req: Request, resp: Response, next: NextFunction) => {

		let foundtags = await prisma.tag.findMany();

		resp.status(200);
		resp.send(foundtags);
	}
);



// get hastags in single post
router.get("/api/v1/tags/:postId",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
	console.log("hello");

	let reqId = parseInt(req.params.postId);
	console.log(reqId);

	let foundPostTags = await prisma.tag.findMany({
		where: {
			tagId: reqId,
		},
		include: {
			PostToTag: {
				select: {
					post: true,
				},
			},
		}
	});
	console.log(foundPostTags, "trovato");
	resp.send(foundPostTags);
}
);



// get all hastag where name is like
router.get("/api/v1/tag/:tagName",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
		let reqName = req.params.tagName;
		console.log(reqName);

		let foundTags = await prisma.tag.findMany({
			where: {
				name: {
					contains: reqName,
				},
			},
			include: {
				PostToTag: {
					select: {
						post: {
							include: {
								author: true,
							},
						},
					},
				},
			},
		});

		resp.status(200);
		resp.send(foundTags);
	}
);




interface CustomRequest extends Request {
    tagExist?: Tag | null;
}
// create a new hastag in a post if it does not exist and add it to all the hastags
router.post("/api/v1/posts/:postId/tags",jwtAuthenticationMiddleware,checkTagExistence,async (req: CustomRequest, resp: Response, next: NextFunction) => {
	
	let reqId = parseInt(req.params.postId);
	let tagExist = req.tagExist;

	let post = await prisma.post.findUnique({
		where: {
			postId: reqId,
		},
	});

	if(post?.authorId !== req.principal.id){
		resp.status(401).send("unauthorized");
		return;
	}

	// Create the PostToTag link if it doesn't exist
	if (tagExist) {	
		let linkedTag = await prisma.postToTag.create({
		data: {
			post: {
			connect: {
				postId: reqId,
			},
			},
			tag: {
			connect: {
				tagId: tagExist.tagId,
			},
			},
		},
		});
	
		resp.send({linkedTag, message:"tag linked"});
		}
	}
);



// delete hastag in a post and remove it from all the hastags
router.delete("/api/v1/posts/:postId/tags/:tagId",jwtAuthenticationMiddleware,async (req: Request, resp: Response, next: NextFunction) => {
		
	let postReqId = parseInt(req.params.postId);
	let tagReqId = parseInt(req.params.tagId);

		let post = await prisma.post.findUnique({
			where: {
				postId: postReqId,
			},
		});

		if (post?.authorId !== req.principal.id) {
			resp.status(401).send("unauthorized");
			return;
		}

		// Remove the tag from the post
		let deletedTag = await prisma.postToTag.delete({
			where: {
				postId_tagId: {
					postId: postReqId,
					tagId: tagReqId,
				},
			},
		});

		// Check if there are any other posts associated with the tag
		const postCount = await prisma.postToTag.count({
			where: {
				tagId: tagReqId,
			},
		});

		// delete the tag if there are no other posts associated with it
		if (postCount === 0) {
			let deletedTagCountZero = await prisma.tag.delete({
				where: {
					tagId: tagReqId,
				},
			});
		
			resp.send({ deletedTagCountZero, message: "tag removed from post and all tags" });
		} else {
			resp.send({ deletedTag, message: "tag removed" });
		}
		
	}
);

export default router;