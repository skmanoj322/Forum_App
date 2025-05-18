import { useEffect, useRef, useState } from "react";
import { Sparkles, ThumbsUp, MessageCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";

const mockSession = {
	user: {
		name: "Mock User",
		email: "mock@example.com",
	},
};

const generateMockForums = (count = 50) =>
	Array.from({ length: count }).map((_, i) => ({
		id: (i + 1).toString(),
		title: `Forum Topic ${i + 1}`,
		description: `This is a discussion on topic number ${i + 1}.`,
		tags: ["general", i % 2 === 0 ? "discussion" : "help"],
		createdAt: new Date(Date.now() - i * 10000000).toLocaleString(),
		upvotes: Math.floor(Math.random() * 100),
		comments: Array.from({ length: Math.floor(Math.random() * 5) }).map(
			(_, j) => ({
				id: `c${i}-${j}`,
				content: `Comment ${j + 1} on forum ${i + 1}`,
				author: `User ${j + 1}`,
				createdAt: new Date(Date.now() - j * 500000).toLocaleString(),
			})
		),
	}));

export default function HomePage() {
	const session = useSession();
	const [allForums] = useState(generateMockForums());
	const [forums, setForums] = useState(allForums.slice(0, 10));
	const [page, setPage] = useState(1);
	const [selectedForum, setSelectedForum] = useState(null);
	const [newComment, setNewComment] = useState("");
	const containerRef = useRef(null);

	const handleSignIn = () => {
		signIn("google", {
			callbackUrl: "/forum",
		});
	};

	return (
		<div className="p-6  mt-7 max-w-md mx-auto text-center rounded-xl bg-white shadow-xl">
			<h1 className="text-4xl font-extrabold mb-2 text-blue-700 flex justify-center items-center gap-2">
				<Sparkles className="w-6 h-6 text-blue-500" />
				Community Forums
			</h1>
			<p className="mb-4 text-gray-600">Please sign in to continue</p>
			<button
				onClick={handleSignIn}
				className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition"
			>
				Sign in with Google (Mock)
			</button>
		</div>
	);
}

// return (
// 	<div
// 		className="p-4 max-w-2xl mx-auto h-screen overflow-y-auto space-y-4"
// 		ref={containerRef}
// 	>
// 		<div className="flex justify-between items-center mb-4">
// 			<h1 className="text-3xl font-bold text-blue-700">
// 				Community Forums
// 			</h1>
// 			<div className="flex gap-4 items-center">
// 				<p className="text-sm text-gray-600">
// 					Hi, {session.user?.name}
// 				</p>
// 				<button
// 					onClick={handleSignOut}
// 					className="text-red-500 hover:underline"
// 				>
// 					Sign Out
// 				</button>
// 			</div>
// 		</div>

// 		{selectedForum ? (
// 			<div className="bg-white rounded-xl shadow p-4">
// 				<button
// 					onClick={() => setSelectedForum(null)}
// 					className="text-blue-500 hover:underline"
// 				>
// 					← Back
// 				</button>
// 				<h2 className="text-2xl font-semibold mt-2">
// 					{selectedForum.title}
// 				</h2>
// 				<p className="text-gray-700 mb-1">
// 					{selectedForum.description}
// 				</p>
// 				<p className="text-sm text-gray-500">
// 					Posted on: {selectedForum.createdAt}
// 				</p>
// 				<p className="text-sm text-gray-500 mb-2">
// 					Upvotes: {selectedForum.upvotes}
// 				</p>
// 				<div className="mb-3">
// 					{selectedForum.tags.map((tag) => (
// 						<span
// 							key={tag}
// 							className="text-xs bg-blue-100 text-blue-700 font-semibold rounded-full px-3 py-1 mr-2"
// 						>
// 							#{tag}
// 						</span>
// 					))}
// 				</div>

// 				<div className="mt-4">
// 					<h3 className="font-semibold mb-2">
// 						Comments ({selectedForum.comments.length})
// 					</h3>
// 					{selectedForum.comments.map((comment) => (
// 						<div
// 							key={comment.id}
// 							className="border rounded-lg p-3 my-2 bg-gray-50"
// 						>
// 							<p className="text-sm text-gray-600">
// 								{comment.author} • {comment.createdAt}
// 							</p>
// 							<p className="mt-1 text-gray-800">
// 								{comment.content}
// 							</p>
// 						</div>
// 					))}

// 					<textarea
// 						value={newComment}
// 						onChange={(e) => setNewComment(e.target.value)}
// 						placeholder="Add a comment"
// 						className="w-full border mt-4 p-2 rounded-lg"
// 					/>
// 					<button
// 						onClick={handleCommentSubmit}
// 						className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
// 					>
// 						Submit
// 					</button>
// 				</div>
// 			</div>
// 		) : (
// 			<div className="space-y-4">
// 				{forums.map((forum) => (
// 					<div
// 						key={forum.id}
// 						onClick={() => setSelectedForum(forum)}
// 						className="cursor-pointer bg-white border hover:shadow-md p-4 rounded-lg transition"
// 					>
// 						<h2 className="text-xl font-semibold text-blue-800">
// 							{forum.title}
// 						</h2>
// 						<p className="text-gray-700 mt-1">
// 							{forum.description}
// 						</p>
// 						<p className="text-sm text-gray-500 mt-1">
// 							Posted on: {forum.createdAt}
// 						</p>
// 						<div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
// 							<span className="flex items-center gap-1">
// 								<ThumbsUp className="w-4 h-4" />{" "}
// 								{forum.upvotes}
// 							</span>
// 							<span className="flex items-center gap-1">
// 								<MessageCircle className="w-4 h-4" />{" "}
// 								{forum.comments.length}
// 							</span>
// 						</div>
// 						<div className="mt-3">
// 							{forum.tags.map((tag) => (
// 								<span
// 									key={tag}
// 									className="text-xs bg-blue-100 text-blue-700 font-semibold rounded-full px-3 py-1 mr-2"
// 								>
// 									#{tag}
// 								</span>
// 							))}
// 						</div>
// 					</div>
// 				))}
// 			</div>
// 		)}
// 	</div>
// );
