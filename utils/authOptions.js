import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";
import User from '@/models/user'
import Auth0Provider from "next-auth/providers/auth0";


import bcrypt from "bcrypt"

import dbConnect from "@/utils/dbConnect";
import LoginAttempt from "@/models/loginattempt"

const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 30 * 1000; // 30 seconds
export const authOptions = {

    session: {

        strategy: 'jwt'

    },

    providers: [

        CredentialsProvider({

            async authorize(credentials, req) {
                await dbConnect()
                const { email, password } = credentials



                let loginAttempt = await LoginAttempt.findOne({ email: email });

                if (!loginAttempt) {
                    loginAttempt = new LoginAttempt({ email: email });
                }

                if (loginAttempt.blockedUntil && loginAttempt.blockedUntil > new Date()) {
                    const remainingTime = (new Date(loginAttempt.blockedUntil) - new Date()) / 1000;
                    throw new Error(`Too many failed login attempts. Try again in ${remainingTime.toFixed(0)} seconds.`);
                }




                const user = await User.findOne({ email })

                if (!user?.password) {

                    throw new Error("please  login via  the method used to  sign up")

                }



                const isPasswordValid = user && await bcrypt.compare(password, user.password)


                if (!isPasswordValid) {
                    loginAttempt.attempts += 1;
                    loginAttempt.lastAttempt = new Date();


                    console.log("1")
                    if (loginAttempt.attempts >= MAX_ATTEMPTS) {
                        console.log("Login attempt exceeded")
                        loginAttempt.blockedUntil = new Date(Date.now() + BLOCK_TIME);
                    }

                    await loginAttempt.save();
                    throw new Error('Invalid email or password');
                }


                loginAttempt.attempts = 0;
                loginAttempt.blockUntil = null;

                await loginAttempt.save()



                return user



            }






        }),



        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_CLIENT_ID,
        //     clientSecret: process.env.FACEBOOK_CLIENT_SECRET
        // }),

        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET
        }),
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH0_ISSUER
        })





    ],
    callbacks: {


        async signIn({ user }) {

            await dbConnect();
            console.log("user", user)
            const { email } = user;

            //try to find  a user  with  the  provided email 


            let dbUser = await User.findOne({ email: email });
            //if the user is not found

            if (!dbUser) {
                dbUser = await User.create({

                    email,
                    name: user.name,


                });




            }


            return true;

        },







        jwt: async ({ token }) => {

            console.log("token: ", token)
            const userByEmail = await User.findOne({ email: token.email })

            userByEmail.password = undefined;

            token.user = userByEmail

            return token
        },





        session: async ({ session, token }) => {


            console.log("session", session)
            session.user = token.user

            return session

        }


    },


    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login'



    },
    debug: true,

}




