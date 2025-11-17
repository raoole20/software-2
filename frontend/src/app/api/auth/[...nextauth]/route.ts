import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
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

          // Basic runtime validation of backend response
          const isValid = (d: any) => {
            return !!d && typeof d.token === 'string' && d.user && (typeof d.user.id === 'number' || typeof d.user.id === 'string') && typeof d.user.email === 'string'
          }

          if (!res.ok || !isValid(data)) {
            console.error('Invalid login response from backend', { status: res.status, body: data })
            return null;
          }

          // Normalize user id to number when possible
          const user = { ...(data.user as any) } as any
          if (typeof user.id === 'string' && !Number.isNaN(Number(user.id))) user.id = Number(user.id)

          // Store initial setup requirement flag
          user.requiereConfiguracionInicial = data.requiere_configuracion_inicial

          return { ...user, accessToken: data.token };
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
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
