import { cookies } from 'next/headers';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getToken } from 'next-auth/jwt';

const authApiURL = (process.env.NODE_ENV === 'production' ? 'https://web-games-backend.vercel.app/' : 'http://localhost:8000/') + 'api/auth/signin';

export const authOptions = (req: any) => ({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 10 * 365 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      id: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials: any): Promise<any> => {
        const { isGuest, isInitial, username, password } = credentials;

        try {
          const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
          });

          if (isGuest) {
            const response = await fetch(authApiURL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                asGuest: true,
              }),
            }).then((res) => res.json());

            return {
              pid: response?.playerCookie,
              name: 'Guest',
              settings: response?.settings,
            };
          }

          const response = await fetch(authApiURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
              oldPid: isInitial ? undefined : token?.pid,
            }),
          }).then((res) => res.json());

          if (response?.playerCookie) {
            return {
              pid: response?.playerCookie,
              name: username,
              settings: response?.settings,
            };
          }

          return null;
        } catch (error) {
          return null;
        }

      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user?.pid) token.pid = user.pid;
      if (user?.settings) token.settings = user.settings;

      if (trigger === 'update' && session) {
        Object.entries(session).forEach(([key, value]) => {
          token[key] = value;
        });
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token.name) session.user.name = token.name;
      if (token.pid) session.user.pid = token.pid;
      if (token.settings) session.user.settings = token.settings;

      return session;
    },
  },
  events: {
    async signOut() {
      // remove access token
      cookies().set('pid', '', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1,
      });

      // remove session token
      cookies().set(
        process.env.NODE_ENV === 'development'
          ? 'next-auth.session-token'
          : '__Secure-next-auth.session-token',
        '',
        {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: -1,
        }
      );

      return Promise.resolve();
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
});

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: any, res: any) => {
  return NextAuth(req, res, (authOptions as any)(req, res));
};
