import { prisma } from "@/prisma";

export const getAllForum = async ({
	id,
}: {
	id?: string | undefined | string[];
}) => {
	if (typeof id === "string") {
		const formbyId = await prisma.forum.findUnique({
			where: {
				id,
			},
			include: {
				comments: {
					include: {
						user: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				},
			},
		});

		return formbyId;
	}

	const form = await prisma.forum.findMany({
		include: {
			comments: {
				include: { user: { select: { name: true, email: true } } },
			},
		},
	});

	return form;
};
