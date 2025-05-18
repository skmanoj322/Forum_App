import { prisma } from "@/prisma";

export const deleteComment = async ({
	id,
	userId,
}: {
	id: string;
	userId: string;
}) => {
	const deleteCommentData = await prisma.comment.delete({
		where: {
			id,
			userId,
		},
	});

	return deleteCommentData;
};
