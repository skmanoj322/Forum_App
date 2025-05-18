import {
	Sparkles,
	ThumbsUp,
	MessageCircle,
	Plus,
	X,
	Trash2,
	Pencil,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type FormData = {
	title: string;
	description: string;
	tags: string;
	id?: string;
};

export type ForumArray = {
	comments: {
		id: string;
		content: string;
		createdAt: string;
		userId: string;
		forumId: string;
		user: {
			name: string;
		};
	}[];
	createdAt: string;

	description: string;

	id: string;

	tags: string[];

	title: string;

	updatedAt: string;
	userId?: string;
};

export default function Forum() {
	const session = useSession();
	const router = useRouter();

	const [forums, setForums] = useState<ForumArray[]>();
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		title: "",
		description: "",
		tags: "",
		id: "",
	});
	const [editingForum, setEditingForum] = useState(null);
	const getAllforms = async () => {
		const data = await fetch("/api/v1/forums", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const parsedData = await data.json();

		setForums(parsedData);
	};

	useEffect(() => {
		getAllforms();
	}, []);

	const handleDeleteForum = async (id: string) => {
		const deleteById = await fetch("/api/v1/forums", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
				userId: session.data?.user.id,
			}),
		});

		const result = await deleteById.json();

		if (deleteById.ok) {
			console.log("Deleted successfully:", result);
			getAllforms();
		} else {
			console.error("Error deleting forum:", result.message);
		}
	};

	const handleSubmitForum = async (type: "POST" | "PUT") => {
		const { title, description, tags, id } = formData;
		const tagArr = tags
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);
		if (!title || !description || !session?.data?.user?.name) return;
		const newForum = {
			title,
			description,
			tags: tagArr,
		};

		const postForum = await fetch("/api/v1/forums", {
			body: JSON.stringify(
				type === "POST"
					? newForum
					: { ...newForum, id, userId: session.data.user.id }
			),
			method: type,
			headers: {
				"Content-Type": "application/json",
			},
		});
		const result = await postForum.json();

		if (postForum.ok) {
			getAllforms();
		} else {
			console.error("Error deleting forum:", result.message);
		}

		setShowModal(false);
	};
	const handleOpenModal = (forum?: any) => {
		setEditingForum(forum);
		setFormData({
			title: forum?.title || "",
			description: forum?.description || "",
			tags: forum?.tags.join(",") || "",
			id: forum?.id,
		});
		setShowModal(true);
	};

	return (
		<div className="p-4 max-w-2xl mx-auto h-screen overflow-y-auto space-y-4">
			{showModal && (
				<div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow w-full max-w-md">
						<div className="flex justify-between mb-4">
							<h2 className="text-lg font-semibold">
								{editingForum ? "Edit Forum" : "Create Forum"}
							</h2>
							<button onClick={() => setShowModal(false)}>
								<X className="w-5 h-5" />
							</button>
						</div>
						<input
							className="w-full border p-2 rounded mb-2"
							placeholder="Title"
							value={formData.title}
							onChange={(e) =>
								setFormData({
									...formData,
									title: e.target.value,
								})
							}
						/>
						<textarea
							className="w-full border p-2 rounded mb-2"
							placeholder="Description"
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
						/>
						<input
							className="w-full border p-2 rounded mb-4"
							placeholder="Tags (comma-separated)"
							value={formData.tags}
							onChange={(e) =>
								setFormData({
									...formData,
									tags: e.target.value,
								})
							}
						/>
						<button
							className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
							onClick={() =>
								handleSubmitForum(editingForum ? "PUT" : "POST")
							}
						>
							{editingForum ? "Update Forum" : "Create Forum"}
						</button>
					</div>
				</div>
			)}
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-3xl font-bold text-blue-700">
					Community Forums
				</h1>
				<div className="flex gap-4 items-center">
					<p className="text-sm text-gray-600">
						Hi, {session.data?.user.name}
					</p>
					<button
						className="text-red-500 hover:underline"
						onClick={async () => {
							await signOut({
								redirect: true,
								callbackUrl: "/",
							});
						}}
					>
						Sign Out
					</button>
				</div>
			</div>
			<div className="flex justify-end mb-4">
				<button
					onClick={() => handleOpenModal()}
					className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
				>
					<Plus className="w-4 h-4" /> Create Forum
				</button>
			</div>

			<div className="space-y-4">
				{forums?.map((forum) => (
					<div
						key={forum.id}
						className="relative bg-white border hover:shadow-md p-4 rounded-lg transition"
						onClick={() => {
							router.push(`/forum/${forum.id}`);
						}}
					>
						<h2 className="text-xl font-semibold text-blue-800 cursor-pointer">
							{forum.title}
						</h2>
						<p className="text-gray-700 mt-1">
							{forum.description}
						</p>
						<p className="text-sm text-gray-500 mt-1">
							Posted on: {forum.createdAt}
						</p>
						<div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
							<span
								className="flex items-center gap-1"
								title={`Upvoted by:`}
							>
								{/* <ThumbsUp className="w-4 h-4" /> {forum.upvotes} */}
							</span>
							<span className="flex items-center gap-1">
								<MessageCircle className="w-4 h-4" />{" "}
								{forum.comments.length}
							</span>
						</div>
						<div className="mt-3 flex items-center gap-2">
							{forum.tags.map((tag: any) => (
								<span
									key={tag}
									className="text-xs bg-blue-100 text-blue-700 font-semibold rounded-full px-3 py-1"
								>
									#{tag}
								</span>
							))}
						</div>
						{
							<div className="absolute top-2 right-2 flex gap-2">
								{forum.userId === session.data?.user.id && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleOpenModal(forum);
										}}
										title="Edit"
									>
										<Pencil className="w-4 h-4 text-yellow-600 hover:text-yellow-700" />
									</button>
								)}
								{forum.userId === session.data?.user.id && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteForum(forum.id);
										}}
										title="Delete"
									>
										<Trash2 className="w-4 h-4 text-red-600 hover:text-red-700" />
									</button>
								)}
							</div>
						}
					</div>
				))}
			</div>
		</div>
	);
}
