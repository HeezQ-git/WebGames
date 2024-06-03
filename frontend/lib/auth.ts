import { cookies } from 'next/headers';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const authApiURL = 'http://localhost:8000/api/auth/signin';

export const authOptions = (req: any, res: any) => ({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: process.env.NODE_ENV === 'development' ? 24 * 60 * 60 : 30 * 60,
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
              oldPid: isInitial ? undefined : cookies().get('pid')?.value,
            }),
          }).then((res) => res.json());

          if (response?.playerCookie) {
            return {
              pid: response?.playerCookie,
              name: username,
            };
          }
        } catch (error) {
          return null;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) token.pid = user.pid;
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token.name) session.user.name = token.name;
      if (cookies().get('pid') !== token.pid) {
        cookies().set(
          'pid',
          token.pid,
          {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 365,
          }
        );
      }

      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'development'
          ? 'next-auth.session-token'
          : '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365,
      },
    },
  },
  events: {
    async signOut({ token }: any) {
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
