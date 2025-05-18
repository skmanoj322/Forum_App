import { prisma } from "@/prisma";

type FormUpdateParams = {
	id: string;
	userId: string;
	title?: string;
	description?: string;
	tags?: string[];
};
export const updateFormHandler = async ({
	id,
	userId,
	...data
}: FormUpdateParams) => {
	const updateFormData = await prisma.forum.update({
		where: {
			id,
			userId,
		},
		data,
	});

	return updateFormData;
};
