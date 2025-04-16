import KeycloakProvider from "next-auth/providers/keycloak";
import { AuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import { requestRefreshOfAccessToken } from "@/lib/refresh";

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID as string,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
            issuer: process.env.KEYCLOAK_ISSUER as string,
        }),
    ],
    session: {
        maxAge: 60 * 30
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.idToken = account.id_token;
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
            }
            if (Date.now() < (token.expiresAt! * 1000 - 60 * 1000)) {
                return token
            } else {
                try {
                    const response = await requestRefreshOfAccessToken(token);
                    const tokens: TokenSet = await response.json();

                    if (!response.ok) throw tokens

                    const updatedToken: JWT = {
                        ...token,
                        idToken: tokens.id_token,
                        accessToken: tokens.access_token,
                        expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
                        refreshToken: tokens.refresh_token ?? token.refreshToken,
                    }
                    return updatedToken
                } catch (error) {
                    console.error("Error refreshing access token", error)
                    return { ...token, error: "RefreshAccessTokenError" }
                }
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.idToken = token.idToken;
            session.refreshToken = token.refreshToken;
            session.expiresAt = token.expiresAt;
            return session;
        },
    },
};