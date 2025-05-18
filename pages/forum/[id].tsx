import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRouter as Route } from "next/router";

import { useEffect, useState } from "react";
import { ForumArray } from ".";

const FormId = () => {
	const router = useRouter();
	const Router = Route();
	const [commentSection, setCommentSection] = useState<ForumArray | null>();
	const [eachComment, setEachComment] = useState();
	const session = useSession();
	const { id: forumId } = Router.query;

	const [newComment, setNewComment] = useState("");

	const getAllComment = async (id: string) => {
		if (id) {
			const data = await fetch(`/api/v1/forums?formId=${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const parsedData = await data.json();
			setCommentSection(parsedData);
		}
	};

	useEffect(() => {
		getAllComment(forumId as string);
	}, [forumId]);

	const deleteCommenthandler = async (comment: any) => {
		const deleteById = await fetch("/api/v1/deleteComment", {
			method: "DELETE",
			body: JSON.stringify({ id: comment.id }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		await getAllComment(forumId as string);
	};
	const submitHandler = async () => {
		const body = {
			content: newComment,
			forumId,
		};

		const newData = await fetch(`/api/v1/comment`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		await getAllComment(forumId as string);

		const result = await newData.json();
		setNewComment("");
	};

	// console.log(commentSection);
	return (
		<div className="p-4 max-w-2xl mx-auto h-screen overflow-y-auto space-y-4">
			<div className="bg-white rounded-xl shadow p-4">
				<button
					onClick={() => router.push("/forum")}
					className="text-blue-500 hover:underline"
				>
					← Back
				</button>
				<h2 className="text-2xl font-semibold mt-2">
					{commentSection?.title}
				</h2>
				<p className="text-gray-700 mb-1">
					{commentSection?.description}
				</p>
				<p className="text-sm text-gray-500">
					Posted on: {commentSection?.createdAt}
				</p>
				{/* <p className="text-sm text-gray-500 mb-2">
					Upvotes: {commentSection?.upvotes}
				</p> */}
				<div className="mb-3">
					{commentSection?.tags.map((tag) => (
						<span
							key={tag}
							className="text-xs bg-blue-100 text-blue-700 font-semibold rounded-full px-3 py-1 mr-2"
						>
							#{tag}
						</span>
					))}
				</div>

				<div className="mt-4">
					<h3 className="font-semibold mb-2">
						Comments ({commentSection?.comments.length})
					</h3>
					{commentSection?.comments.map((comment) => (
						<div
							key={comment.id}
							className="border rounded-lg p-3 my-2 bg-gray-50"
						>
							<div className="flex justify-between items-start">
								<div>
									<p className="text-sm text-gray-600">
										{comment?.user.name} •
										{comment?.createdAt}
									</p>
									<p className="mt-1 text-gray-800">
										{comment.content}
									</p>
								</div>
								{comment.userId === session.data?.user.id && (
									<button
										onClick={() =>
											deleteCommenthandler(comment)
										}
										title="Delete comment"
										className="text-red-500 hover:text-red-700"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								)}
							</div>
						</div>
					))}

					<textarea
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder="Add a comment"
						className="w-full border mt-4 p-2 rounded-lg"
					/>
					<button
						onClick={submitHandler}
						className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default FormId;
