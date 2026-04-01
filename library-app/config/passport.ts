import bcrypt from "bcrypt";
import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js";

interface DoneCallback {
  (error: any, user?: Express.User | false | null, options?: { message: string }): void;
}

const passportConfig = (passport: PassportStatic): void => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email: string, password: string, done: DoneCallback) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          const match = await bcrypt.compare(password, user.passwordHash);
          if (!match) {
            return done(null, false, { message: "Wrong password" });
          }

          return done(null, user);
        } catch (e: any) {
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as any).id || (user as any)._id?.toString());
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (e: any) {
      done(e);
    }
  });
};

export default passportConfig;
