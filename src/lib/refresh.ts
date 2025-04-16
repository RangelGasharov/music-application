import { JWT } from "next-auth/jwt";

export async function requestRefreshOfAccessToken(token: JWT) {
    const clientId = process.env.KEYCLOAK_CLIENT_ID;
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
    const issuer = process.env.KEYCLOAK_ISSUER;
    const refreshToken = token.refreshToken;

    if (!clientId || !clientSecret || !issuer || !token.refreshToken) {
        throw new Error("Missing required environment variables or refresh token.");
    }

    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
    });

    return fetch(`${issuer}/protocol/openid-connect/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
        cache: "no-store",
    });
}