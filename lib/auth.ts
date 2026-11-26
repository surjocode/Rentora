
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "rentora";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const client = new MongoClient(MONGODB_URI);
const db = client.db(DB_NAME);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
  ],

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ["renter", "owner", "admin"],
        required: false,
        defaultValue: "renter",
        input: false,
      },
    },
  },
  //
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          email: user.email,
          role: user.role,
        }),
      },
    }),
  ],
});
