import { PrismaClient, Tag} from "@prisma/client";
import "dotenv/config";
import {Request, Response, NextFunction} from "express";


const prisma = new PrismaClient();

interface customRequest extends Request {
	tagExist?: Tag | null;
}

const checkTagExistence = async (
	req: customRequest,
	resp: Response,
	next: NextFunction
) => {

	let reqId = parseInt(req.params.postId);

	let tagExist = await prisma.tag.findUnique({
		where: {
			name: req.body.name,
		},
	});

	// if tag does not exist, create it
	if (!tagExist) {
		let createdTag = await prisma.tag.create({
			data: {
				name: req.body.name,
				PostToTag: {
					create: {
						post: {
							connect: {
								postId: reqId,
							},
						},
					},
				},
			},
		});

		resp.send(createdTag);
		return;
	} else {
		req.tagExist = tagExist;
		next();
	}

	// if tag exists, check if it is already linked to the post
	if (tagExist) {
		let existingPostToTag = await prisma.postToTag.findUnique({
			where: {
				postId_tagId: {
					postId: reqId,
					tagId: tagExist.tagId,
				},
			},
		});

		if (existingPostToTag) {
			resp.send({message: "Tag already linked to the post"});
			return;
		}
	}
};

export default checkTagExistence;
