import KeycloakProvider from "next-auth/providers/keycloak";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID as string,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
            issuer: process.env.KEYCLOAK_ISSUER as string
        })
    ]
};