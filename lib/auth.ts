import { betterAuth } from "better-auth";
import { getDb } from "./db"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import * as schema from "@/auth-schema"

export const auth = betterAuth({
    database: drizzleAdapter(await getDb(), {
        provider: "mysql",
        schema: schema
    }),
    user: {
        additionalFields: {
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
                    redirectURI: `${process.env.BETTER_AUTH_URL!}/api/auth/oauth2/callback/vatsim`,
                    overrideUserInfo: true,
                    mapProfileToUser: async (profile) => {
                        return {
                            id: profile.data.cid,
                            name: profile.data.personal.name_full,
                            email: profile.data.personal.email,
                            emailVerified: true,
                            country: profile.data.personal.country.name,
                            countryCode: profile.data.personal.country.id,
                            ratingShort: profile.data.vatsim.rating.short,
                            ratingLong: profile.data.vatsim.rating.long,
                            pilotRatingShort: profile.data.vatsim.pilotrating.short,
                            pilotRatingLong:profile.data.vatsim.pilotrating.long,
                            regionId: profile.data.vatsim.region.id,
                            regionName: profile.data.vatsim.region.name,
                            divisionId: profile.data.vatsim.division.id,
                            divisionName: profile.data.vatsim.division.name,
                            subDivisionId: profile.data.vatsim.subdivision.id,
                            subDivisionName: profile.data.vatsim.subdivision.name,
                        }
                    }
                }
            ]
        })
    ]
});