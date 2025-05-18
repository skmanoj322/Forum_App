import { prisma } from "@/prisma";

type DeleteFormParams = {
	userId: string;
	id: string;
};
export const deleteForm = async (params: DeleteFormParams) => {
	const { userId, id } = params;

	const deleteForm = await prisma.forum.delete({
		where: {
			id,
			userId,
		},
	});

	return deleteForm;
};
