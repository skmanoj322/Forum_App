import { prisma } from "@/prisma";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/",
	},
	callbacks: {
		async session({ session, token, user }) {
			const userDetail = await prisma.user.findUnique({
				where: {
					email: session.user.email,
				},
			});

			if (session.user && userDetail?.id) {
				session.user.id = userDetail?.id;
			}

			return session;
		},
		async signIn(params) {
			const { user } = params;

			if (!user.email) return false;

			const existingUser = await prisma.user.findUnique({
				where: {
					email: user?.email,
				},
			});

			if (!existingUser) {
				// create new row

				await prisma.user.create({
					data: {
						email: user.email,
						name: user.name,
					},
				});
			}

			return true;
		},
	},
};

export default NextAuth(authOptions);
