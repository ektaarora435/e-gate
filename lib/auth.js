import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import DB from "@/lib/db";
import Profile from "@/models/Profile";

await DB();

const authOptions = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "select", options: ["resident", "visitor", "staff"] },
      },
      async authorize(credentials) {
        const { email, password, role } = credentials;
        const user = await Profile.findOne({ email });
        if (!user) {
          throw new Error("No User found");
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new Error("Invalid Password");
        }

        if (user.role !== role) {
          throw new Error("Invalid Role");
        }

        return { id: user._id, name: user.name, email: user.email, role: user.role };
      },
      async register(credentials) {
        const { email, password, name } = credentials;
        const userFound = await Profile.findOne({ email });
        if (userFound) {
          throw new Error("User with this email already exists!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Profile({
          name,
          email,
          password: hashedPassword,
        });

        const savedUser = await user.save();
        return savedUser;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.role = token.role
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },
  }
};

export default authOptions;
