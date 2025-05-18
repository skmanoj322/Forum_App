import { prisma } from "@/prisma";

type CommentParams = {
	forumId: string;
	userId: string;
	content: string;
};

export const createComment = async ({
	forumId,
	userId,
	content,
}: CommentParams) => {
	const commentData = await prisma.comment.create({
		data: {
			userId,
			forumId,
			content,
		},
		include: {
			user: { select: { name: true } },
		},
	});

	return commentData;
};
