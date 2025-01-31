import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// 1. Define GraphQL Schema (Type Definitions)
const typeDefs = `

type User {
  id: Int!
  email: String!
  name: String!
}

type Query {
  users: [User!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: Int!, name: String, email: String): User!
  deleteUser(id: Int!): User!
}
`;

interface MyContext {
  userId?: string;
}

interface UserFilter {
  // Define a type for your filter arguments
  name?: string;
  email?: string;
  // Add other filterable fields as needed
}

// 2. Define Resolvers (Implementation)
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    users: async (_: unknown, args: UserFilter, context: MyContext) => {
      if (!context.userId) {
        throw new Error("Not authenticated!");
      }
      const {
        /* name, email */
      } = args;

      // Build the where clause for Prisma based on the input arguments
      const where = {};
      // Example of how to add filters for name and email:
      // if (name) {
      //   where.name = { contains: name };
      // }
      // if (email) {
      //   where.email = { contains: email };
      // }

      // Fetch users from the database using Prisma
      const users = await prisma.user.findMany({
        where,
        orderBy: {
          id: "asc", // or 'desc' for descending order
        },
      });

      // console.log(users);

      return users; // Directly return the array of users
    },
  },
  Mutation: {
    createUser: async (
      _: unknown,
      { name, email }: { name: string; email: string },
      context: MyContext
    ) => {
      // Check for authentication
      if (!context.userId) {
        throw new Error("Not authenticated!");
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
      return newUser;
    },
    updateUser: async (
      _: unknown,
      { id, name, email }: { id: number; name?: string; email?: string },
      context: MyContext
    ) => {
      // Check for authentication
      if (!context.userId) {
        throw new Error("Not authenticated!");
      }

      const updateData: { name?: string; email?: string } = {};
      if (name !== undefined) {
        updateData.name = name;
      }
      if (email !== undefined) {
        updateData.email = email;
      }

      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: updateData,
      });

      return updatedUser;
    },
    deleteUser: async (
      _: unknown,
      { id }: { id: number },
      context: MyContext
    ) => {
      // Check for authentication
      if (!context.userId) {
        throw new Error("Not authenticated!");
      }

      try {
        // Delete the user using Prisma
        const deletedUser = await prisma.user.delete({
          where: {
            id,
          },
        });

        // Return a deleteUserResponse object
        return deletedUser;
      } catch (error) {
        console.error("Error deleting user:", error);
        // Handle errors (e.g., user not found) and return an appropriate response
        throw new Error("Failed to delete user");
      }
    },
  },
};

// Initialize the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Export the handler as the default API route export
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  //*add validation to the context api
  context: async (req) => {
    try {
      // 1. Get token from Authorization header:
      const authHeader = req.headers.get("authorization");
      if (!authHeader) return {}; // No header, return empty context
      const token = authHeader.split(" ")[1]; // "Bearer <token>"
      // 2. Verify the token and decode:
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      // 3. Add userId to the context
      return { userId: decoded.userId };
    } catch (error) {
      console.error("Authentication error:", error);
      return {}; // Invalid token, return empty context
    }
  },
});

export async function POST(request: NextRequest) {
  return handler(request);
}

export async function GET(request: NextRequest) {
  return handler(request);
}
