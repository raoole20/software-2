import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;  
        console.log("Credentials received:", credentials)

        const backend =
          process.env.BACKEND_URL ??
          process.env.NEXT_PUBLIC_BACKEND_URL ??
          "http://127.0.0.1:8000";
        try {
          const res = await fetch(`${backend}/api/users/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            return null;
          }

          return { ...data.user, accessToken: data.token };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  jwt: {},
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in, persist accessToken from authorize() (user.accessToken)
      if (user && (user as any).accessToken) {
        token.accessToken = (user as any).accessToken;
        token.user = { ...(user as any) };
      }
      return token;
    },
    async session({ session, token }) {
      // Make the token and user available in the session on the client
      (session as any).accessToken = (token as any).accessToken;
      session.user = (token as any).user ?? session.user;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

export { handler as GET, handler as POST };
