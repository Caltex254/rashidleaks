// RASHID LEAKS - Authentication Configuration

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log('Login attempt for:', credentials.email);

        try {
          // Find user by email
          const user = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          console.log('User found:', user.id, '- checking password...');

          // Check if user is banned
          if (user.isBanned) {
            console.log('Banned user attempted login:', user.email);
            return null;
          }

          // Check if account is locked (using lockedUntil to match schema)
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            console.log('Locked account attempted login:', user.email);
            return null;
          }

          // Verify password
          let isValidPassword: boolean;
          try {
            isValidPassword = await compare(credentials.password, user.passwordHash);
            console.log('Password validation result:', isValidPassword);
          } catch (compareError) {
            console.error('Password comparison error:', compareError);
            return null;
          }
          
          if (!isValidPassword) {
            console.log('Invalid password for user:', user.email);
            
            // Increment failed login attempts
            try {
              await db.user.update({
                where: { id: user.id },
                data: {
                  failedLoginAttempts: { increment: 1 },
                  // Lock account after 5 failed attempts
                  ...(user.failedLoginAttempts >= 4 && {
                    lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                  }),
                },
              });
            } catch (updateError) {
              console.error('Failed to update login attempts:', updateError);
            }
            
            return null;
          }

          console.log('Login successful for user:', user.email);

          // Reset failed login attempts on successful login
          try {
            await db.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
              },
            });
          } catch (updateError) {
            console.error('Failed to reset login attempts:', updateError);
            // Non-critical, continue with login
          }

          return {
            id: user.id,
            email: user.email,
            name: user.displayName || user.username,
            role: user.role,
            username: user.username,
            image: user.avatar,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login?error=1',
  },

  secret: process.env.NEXTAUTH_SECRET,

  events: {
    async signIn({ user }) {
      // Log successful sign in
      console.log(`User signed in: ${user.email}`);
    },
  },
};

// Extend NextAuth types to include our custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      username: string;
    };
  }

  interface User {
    role?: string;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    username: string;
  }
}
