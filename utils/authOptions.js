

import CredentialsProvider from "next-auth/providers/credentials";


import User from "@/models/user";
import LoginAttempt from "@/models/loginattempt"; 

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";

import bcrypt from 'bcrypt'

import dbConnect from "@/utils/dbConnect";
const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 30 * 1000; // 30 seconds



export const authOptions = {

    session: {
        strategy: "jwt",


    },
    providers: [
        CredentialsProvider({

            async authorize(credentials, req) {

                await dbConnect()
                const { email, password } = credentials;

              //  const user = await User.findOne({ email })
                // if (!user?.password) {

                //     throw new Error("please login   via  the method to use sign in")
                // }


                // const isPasswordMatch = await bcrypt.compare(password, user.password)


                // if (!isPasswordMatch) {

                //     throw new Error("invalid  email and password")
                // }







                let loginAttempt = await LoginAttempt.findOne({ email:email });

                if (!loginAttempt) {
                    loginAttempt = new LoginAttempt({ email:email });
                }

                if (loginAttempt.blockedUntil && loginAttempt.blockedUntil > new Date()) {
                    const remainingTime = (new Date(loginAttempt.blockedUntil) - new Date()) / 1000;
                    throw new Error(`Too many failed login attempts. Try again in ${remainingTime.toFixed(0)} seconds.`);
                }

                const user = await User.findOne({ email: email });
                 if (!user?.password) {

                     throw new Error("please login   via  the method to use sign in")
                 }




                const isPasswordValid = user && await bcrypt.compare(password, user.password)

                if (!isPasswordValid) {
                    loginAttempt.attempts += 1;
                    loginAttempt.lastAttempt = new Date();

                    if (loginAttempt.attempts >= MAX_ATTEMPTS) {
                        loginAttempt.blockedUntil = new Date(Date.now() + BLOCK_TIME);
                    }

                    await loginAttempt.save();
                    throw new Error('Invalid email or password');
                }

                loginAttempt.attempts = 0;
                loginAttempt.blockedUntil = null;
                await loginAttempt.save();


                await User.findOneAndUpdate(
                    { email: user.email },
                    { $push: { loginTimes: new Date() } },
                    { upsert: true, new: true }
                );



                return user


            }



        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
        }),


    ],




    callbacks: {

        jwt: async ({ token }) => {
            //console.log("jwt token:" ,token)
            const userByemail = await User.findOne({ email: token.email })
            userByemail.password = undefined;

            token.user = userByemail;

            //  console.log("jwt tokenby  email:", token)
            return token;


        },
        session: async ({ session, token }) => {
            session.user = token.user;
            return session;
        }



    },

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: '/auth/error',
    }

}