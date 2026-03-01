import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import Invitation from "../models/Invitation.js";
import AuditLog from "../models/AuditLog.js";

const readOAuthState = (state) => {
  if (!state) {
    return { role: "employee", inviteToken: null };
  }

  try {
    const decoded = Buffer.from(state, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded);
    return {
      role: parsed.role === "admin" ? "admin" : "employee",
      inviteToken: parsed.inviteToken || null
    };
  } catch {
    if (state === "admin") {
      return { role: "admin", inviteToken: null };
    }
    return { role: "employee", inviteToken: null };
  }
};

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email) {
            return done(new Error("Google account does not provide an email"), null);
          }

          const avatar = profile.photos?.[0]?.value || "";
          const { role: requestedRole, inviteToken } = readOAuthState(req.query.state);

          // 🔍 check existing user
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }]
          });

          if (user) {
            user.googleId = profile.id;
            user.provider = "google";
            user.name = profile.displayName || user.name;
            user.email = email;
            user.avatar = avatar;
            await user.save();

            await AuditLog.create({
              actor: user._id,
              action: "oauth_login",
              targetType: "user",
              targetId: String(user._id),
              metadata: { role: user.role, email }
            });

            return done(null, user);
          }

          // 🔥 EMPLOYEE INVITE OPTIONAL (not required)
          let invite = null;

          if (requestedRole === "employee" && inviteToken) {
            invite = await Invitation.findOne({
              token: inviteToken,
              email,
              status: "pending",
              expiresAt: { $gt: new Date() }
            });

            if (invite) {
              invite.status = "accepted";
              invite.acceptedBy = null;
              await invite.save();
            }
          }

          // 🟢 create user normally
          user = await User.create({
            provider: "google",
            googleId: profile.id,
            role: requestedRole,
            name: profile.displayName || "User",
            email,
            avatar
          });

          if (invite) {
            invite.acceptedBy = user._id;
            await invite.save();

            await AuditLog.create({
              actor: user._id,
              action: "invite_accepted",
              targetType: "invitation",
              targetId: String(invite._id),
              metadata: { email }
            });
          }

          await AuditLog.create({
            actor: user._id,
            action: "oauth_signup",
            targetType: "user",
            targetId: String(user._id),
            metadata: { role: requestedRole, email }
          });

          return done(null, user);

        } catch (error) {
          console.error("GOOGLE OAUTH ERROR:", error);
          return done(error, null);
        }
      }
    )
  );
};