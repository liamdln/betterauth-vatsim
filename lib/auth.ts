import { betterAuth } from "better-auth";
import { getDb } from "./db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import * as schema from "@/auth-schema";

/**
 * The shape of the data returned by VATSIM's `/api/user` endpoint.
 * See https://vatsim.dev/api/connect-api/get-user
 */
interface VatsimUserDetails {
    cid: number;
    personal: {
        name_full: string;
        email: string;
        country: { id: string; name: string };
    };
    vatsim: {
        rating: { short: string; long: string };
        pilotrating: { short: string; long: string };
        region: { id: string; name: string };
        division: { id: string; name: string };
        subdivision: { id: string; name: string };
    };
}

const createAuth = async () =>
    betterAuth({
        database: drizzleAdapter(await getDb(), {
            provider: "mysql",
            schema: schema
        }),
        user: {
            additionalFields: {
                cid: {
                    type: "number"
                },
                country: {
                    type: "string"
                },
                countryCode: {
                    type: "string"
                },
                ratingShort: {
                    type: "string"
                },
                ratingLong: {
                    type: "string"
                },
                pilotRatingShort: {
                    type: "string"
                },
                pilotRatingLong: {
                    type: "string"
                },
                regionId: {
                    type: "string"
                },
                regionName: {
                    type: "string"
                },
                divisionId: {
                    type: "string"
                },
                divisionName: {
                    type: "string"
                },
                subDivisionId: {
                    type: "string"
                },
                subDivisionName: {
                    type: "string"
                },
            }
        },
        plugins: [
            genericOAuth({
                config: [
                    {
                        providerId: "vatsim",
                        clientId: process.env.VATSIM_CLIENT_ID!,
                        clientSecret: process.env.VATSIM_CLIENT_SECRET,
                        authorizationUrl: `${process.env.VATSIM_AUTH_URL!}/oauth/authorize`,
                        tokenUrl: `${process.env.VATSIM_AUTH_URL!}/oauth/token`,
                        userInfoUrl: `${process.env.VATSIM_AUTH_URL!}/api/user`,
                        scopes: ["full_name", "email", "vatsim_details", "country"],
                        redirectURI: `${process.env.BETTER_AUTH_URL!}/api/auth/callback/vatsim`,
                        // VATSIM Connect does not support PKCE (its authorize
                        // endpoint documents no code_challenge parameters).
                        pkce: false,
                        // VATSIM nests its response under `data`, so the
                        // default `profile.id` subject lookup can't find the
                        // member id — the CID must be resolved explicitly.
                        accountSubject: ({ profile }) => (profile.data as VatsimUserDetails).cid,
                        // Overwrite the stored VATSIM details (ratings,
                        // division, region, ...) on every sign-in so a
                        // rating change or division transfer is picked up
                        // instead of going stale after the first login.
                        overrideUserInfo: true,
                        mapProfileToUser: (profile) => {
                            const details = profile.data as VatsimUserDetails;
                            return {
                                cid: details.cid,
                                name: details.personal.name_full,
                                email: details.personal.email,
                                emailVerified: true,
                                country: details.personal.country.name,
                                countryCode: details.personal.country.id,
                                ratingShort: details.vatsim.rating.short,
                                ratingLong: details.vatsim.rating.long,
                                pilotRatingShort: details.vatsim.pilotrating.short,
                                pilotRatingLong: details.vatsim.pilotrating.long,
                                regionId: details.vatsim.region.id,
                                regionName: details.vatsim.region.name,
                                divisionId: details.vatsim.division.id,
                                divisionName: details.vatsim.division.name,
                                subDivisionId: details.vatsim.subdivision.id,
                                subDivisionName: details.vatsim.subdivision.name,
                            }
                        }
                    }
                ]
            })
        ]
    });

// The auth instance is created lazily and memoised. If it were created at
// module scope (with a top-level await), any database or environment failure
// would throw during module evaluation and take down every route that
// transitively imports auth. This way only requests that actually use auth
// are affected.
let authInstance: Awaited<ReturnType<typeof createAuth>> | null = null;

export async function auth() {
    if (!authInstance) {
        authInstance = await createAuth();
    }
    return authInstance;
}
