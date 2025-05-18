import { createForm } from "@/pages/lib/forum/createForum";
import { getAllForum } from "@/pages/lib/forum/getAllForum";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { updateFormHandler } from "@/pages/lib/forum/updateForum";
import { deleteForm } from "@/pages/lib/forum/deleteForum";

type Method = "GET" | "POST" | "DELETE" | "PUT";
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	if (!session?.user)
		return res.status(405).json({
			message: "session error",
		});

	const { formId } = req.query;

	if (!["GET", "POST", "PUT", "DELETE"].includes(req.method || "")) {
		return res.status(405).json({
			message: "Invalid Method",
		});
	}

	const method: Method = req.method as Method;

	if (method === "GET") {
		const data = await getAllForum({ id: formId });
		return res.send(data);
	}
	if (method === "POST") {
		const { title, tags, description } = req.body;

		const data = await createForm({
			description,
			title,
			userId: session?.user.id,
			tags,
		});
		return res.send(data);
	}

	if (method === "PUT") {
		const { title, description, tags, id } = req.body;
		const data = await updateFormHandler({
			id,
			userId: session?.user.id,
			title,
			description,
			tags,
		});
		return res.send(data);
	}
	if (method === "DELETE") {
		const { id } = req.body;

		const data = await deleteForm({
			id,
			userId: session.user.id,
		});

		res.send(data);
	}
}
