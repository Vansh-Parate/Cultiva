import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (accessToken, refreshToken, profile, done) => {
        // Find or create user in your DB
        let user = await prisma.user.findUnique({ where: { email: profile.emails?.[0].value } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0].value!,
              fullName: profile.displayName,
              username: profile.emails?.[0].value!.split("@")[0],
              password: "", // No password for Google users
            },
          });
        }
        return done(null, user);
      }
    )
  );

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

export default passport;
