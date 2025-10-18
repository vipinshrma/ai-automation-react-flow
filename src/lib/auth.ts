import { betterAuth } from "better-auth";
import { polar ,checkout, portal} from '@polar-sh/better-auth'
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/generated/prisma";
import { polarClient } from "./polar";

const prisma =  new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "4ccbd05e-9c24-4763-a0d8-df16512ee133",
                            slug: "pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/All-the-AI-automation
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal()
            ],
        })
    ]
});