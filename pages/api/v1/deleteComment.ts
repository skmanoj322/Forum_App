import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { createComment } from "@/lib/comment/createComment";
import { deleteComment } from "@/lib/comment/deleteComment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);

	if (req.method !== "DELETE")
		return res.status(400).send({
			message: "Invalid method",
		});
	if (!session?.user)
		return res.status(405).json({
			message: "session error",
		});

	const { id } = req.body;

	console.log("ID", id);

	const deletedCommentdata = await deleteComment({
		id,
		userId: session.user.id,
	});

	return res.send(deletedCommentdata);
};

export default handler;
