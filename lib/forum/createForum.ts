import { prisma } from "@/prisma";

type FormData = {
	title: string;
	description: string;
	tags?: string[];
	userId: string;
};

export const createForm = async ({
	title,
	description,
	tags,
	userId,
}: FormData) => {
	console.log("UTILS", title);
	const newForm = await prisma.forum.create({
		data: {
			title,
			description,
			tags,
			userId,
		},
	});

	return newForm;
};
