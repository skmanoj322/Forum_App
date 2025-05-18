import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { createComment } from "@/pages/lib/comment/createComment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);

	if (req.method !== "POST")
		return res.status(400).send({
			message: "Invalid method",
		});
	if (!session?.user)
		return res.status(405).json({
			message: "session error",
		});

	const { content, forumId } = req.body;

	const commentdata = await createComment({
		content,
		forumId,
		userId: session.user.id,
	});

	return res.send(commentdata);
};

export default handler;
