

// import CredentialsProvider from "next-auth/providers/credentials";


// import User from "@/models/user";
// import LoginAttempt from "@/models/loginattempt"; 

// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import FacebookProvider from "next-auth/providers/facebook";
// import DiscordProvider from "next-auth/providers/discord";
// import TwitterProvider from "next-auth/providers/twitter";

// import bcrypt from 'bcrypt'

// import dbConnect from "@/utils/dbConnect";
// const MAX_ATTEMPTS = 3;
// const BLOCK_TIME = 30 * 1000; // 30 seconds



// export const authOptions = {

//     session: {
//         strategy: "jwt",


//     },
//     providers: [
//         CredentialsProvider({

//             async authorize(credentials, req) {

//                 await dbConnect()
//                 const { email, password } = credentials;

//               //  const user = await User.findOne({ email })
//                 // if (!user?.password) {

//                 //     throw new Error("please login   via  the method to use sign in")
//                 // }


//                 // const isPasswordMatch = await bcrypt.compare(password, user.password)


//                 // if (!isPasswordMatch) {

//                 //     throw new Error("invalid  email and password")
//                 // }







//                 let loginAttempt = await LoginAttempt.findOne({ email:email });

//                 if (!loginAttempt) {
//                     loginAttempt = new LoginAttempt({ email:email });
//                 }

//                 if (loginAttempt.blockedUntil && loginAttempt.blockedUntil > new Date()) {
//                     const remainingTime = (new Date(loginAttempt.blockedUntil) - new Date()) / 1000;
//                     throw new Error(`Too many failed login attempts. Try again in ${remainingTime.toFixed(0)} seconds.`);
//                 }

//                 const user = await User.findOne({ email: email });
//                  if (!user?.password) {

//                      throw new Error("please login   via  the method to use sign in")
//                  }




//                 const isPasswordValid = user && await bcrypt.compare(password, user.password)

//                 if (!isPasswordValid) {
//                     loginAttempt.attempts += 1;
//                     loginAttempt.lastAttempt = new Date();

//                     if (loginAttempt.attempts >= MAX_ATTEMPTS) {
//                         loginAttempt.blockedUntil = new Date(Date.now() + BLOCK_TIME);
//                     }

//                     await loginAttempt.save();
//                     throw new Error('Invalid email or password');
//                 }

//                 loginAttempt.attempts = 0;
//                 loginAttempt.blockedUntil = null;
//                 await loginAttempt.save();


//                 await User.findOneAndUpdate(
//                     { email: user.email },
//                     { $push: { loginTimes: new Date() } },
//                     { upsert: true, new: true }
//                 );



//                 return user


//             }



//         }),

//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         }),
//         GitHubProvider({
//             clientId: process.env.GITHUB_CLIENT_ID,
//             clientSecret: process.env.GITHUB_CLIENT_SECRET,
//         }),
//         FacebookProvider({
//             clientId: process.env.FACEBOOK_CLIENT_ID,
//             clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//         }),
//         DiscordProvider({
//             clientId: process.env.DISCORD_CLIENT_ID,
//             clientSecret: process.env.DISCORD_CLIENT_SECRET,
//         }),
//         TwitterProvider({
//             clientId: process.env.TWITTER_CLIENT_ID,
//             clientSecret: process.env.TWITTER_CLIENT_SECRET,
//         }),


//     ],




//     callbacks: {

//         jwt: async ({ token }) => {
//             //console.log("jwt token:" ,token)
//             const userByemail = await User.findOne({ email: token.email })
//             userByemail.password = undefined;

//             token.user = userByemail;

//             //  console.log("jwt tokenby  email:", token)
//             return token;


//         },
//         session: async ({ session, token }) => {
//             session.user = token.user;
//             return session;
//         }



//     },

//     secret: process.env.NEXTAUTH_SECRET,
//     pages: {
//         signIn: "/login",
//         error: '/auth/error',
//     }

// }




import CredentialsProvider from "next-auth/providers/credentials";
console.log("Imported CredentialsProvider from next-auth/providers/credentials. This provider allows us to use email and password for authentication.");

import User from "@/models/user";
console.log("Imported User model. This is used to interact with the users collection in our database.");

import LoginAttempt from "@/models/loginattempt";
console.log("Imported LoginAttempt model. This is used to track login attempts for each user.");

import GoogleProvider from "next-auth/providers/google";
console.log("Imported GoogleProvider from next-auth/providers/google. This allows authentication using Google accounts.");

import GitHubProvider from "next-auth/providers/github";
console.log("Imported GitHubProvider from next-auth/providers/github. This allows authentication using GitHub accounts.");

import FacebookProvider from "next-auth/providers/facebook";
console.log("Imported FacebookProvider from next-auth/providers/facebook. This allows authentication using Facebook accounts.");

import DiscordProvider from "next-auth/providers/discord";
console.log("Imported DiscordProvider from next-auth/providers/discord. This allows authentication using Discord accounts.");

import TwitterProvider from "next-auth/providers/twitter";
console.log("Imported TwitterProvider from next-auth/providers/twitter. This allows authentication using Twitter accounts.");

import bcrypt from 'bcrypt';
console.log("Imported bcrypt for hashing and comparing passwords securely.");

import dbConnect from "@/utils/dbConnect";
console.log("Imported dbConnect utility for connecting to the database.");

const MAX_ATTEMPTS = 3;
console.log("Defined MAX_ATTEMPTS as", MAX_ATTEMPTS, ". This is the maximum number of allowed failed login attempts before blocking.");

const BLOCK_TIME = 30 * 1000; // 30 seconds
console.log("Defined BLOCK_TIME as", BLOCK_TIME, "milliseconds (30 seconds). This is the time period for which the account is blocked after exceeding max attempts.");

export const authOptions = {
    session: {
        strategy: "jwt",
    },
 //   console.log("Configured session strategy to 'jwt'. This means we'll use JSON Web Tokens for session management.");

    providers: [
        CredentialsProvider({
            async authorize(credentials, req) {
                await dbConnect();
              //  console.log("Connected to the database.");

                const { email, password } = credentials;
              //  console.log("Received credentials:", credentials);

                let loginAttempt = await LoginAttempt.findOne({ email: email });
              //  console.log("Found login attempt record for email:", email, loginAttempt);

                if (!loginAttempt) {
                    loginAttempt = new LoginAttempt({ email: email });
                  //  console.log("No existing login attempt record found. Created new login attempt record:", loginAttempt);
                }

                if (loginAttempt.blockedUntil && loginAttempt.blockedUntil > new Date()) {
                    const remainingTime = (new Date(loginAttempt.blockedUntil) - new Date()) / 1000;
                //    console.log("Account is currently blocked until:", loginAttempt.blockedUntil, ". Remaining time:", remainingTime, "seconds.");
                    throw new Error(`Too many failed login attempts. Try again in ${remainingTime.toFixed(0)} seconds.`);
                }

                const user = await User.findOne({ email: email });
              //  console.log("Found user record for email:", email, user);

                if (!user?.password) {
                //    console.log("User has no password set, indicating they must login via a different method.");
                    throw new Error("Please login via the method used to sign up");
                }

                const isPasswordValid = user && await bcrypt.compare(password, user.password);
               // console.log("Password comparison result for user:", isPasswordValid);

                if (!isPasswordValid) {
                    loginAttempt.attempts += 1;
                    loginAttempt.lastAttempt = new Date();
                  //  console.log("Incremented login attempt count. Updated login attempt record:", loginAttempt);

                    if (loginAttempt.attempts >= MAX_ATTEMPTS) {
                        loginAttempt.blockedUntil = new Date(Date.now() + BLOCK_TIME);
                  //      console.log("Exceeded maximum login attempts. Account is now blocked until:", loginAttempt.blockedUntil);
                    }

                    await loginAttempt.save();
                 //   console.log("Saved updated login attempt record:", loginAttempt);
                    throw new Error('Invalid email or password');
                }

                loginAttempt.attempts = 0;
                loginAttempt.blockedUntil = null;
                await loginAttempt.save();
             //   console.log("Reset login attempt count and unblock time. Saved login attempt record:", loginAttempt);

                await User.findOneAndUpdate(
                    { email: user.email },
                    { $push: { loginTimes: new Date() } },
                    { upsert: true, new: true }
                );
            //    console.log("Updated user login times. Added current login time to user's login history.");

                return user;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
   //     console.log("Configured GoogleProvider with client ID and secret from environment variables. Allows Google account authentication.");

    GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
}),
   // console.log("Configured GitHubProvider with client ID and secret from environment variables. Allows GitHub account authentication.");

FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
}),
  //  console.log("Configured FacebookProvider with client ID and secret from environment variables. Allows Facebook account authentication.");

DiscordProvider({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
}),
  //  console.log("Configured DiscordProvider with client ID and secret from environment variables. Allows Discord account authentication.");

TwitterProvider({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
}),
   // console.log("Configured TwitterProvider with client ID and secret from environment variables. Allows Twitter account authentication.");
    ],

callbacks: {
    jwt: async ({ token }) => {
        console.log("JWT callback triggered with token:", token);

        const userByEmail = await User.findOne({ email: token.email });
        userByEmail.password = undefined;  // Remove the password field for security
        console.log("Found user by email and removed password from user object:", userByEmail);

        token.user = userByEmail;
        console.log("Updated token with user data:", token);

        return token;
    },

        session: async ({ session, token }) => {
            session.user = token.user;
        //    console.log("Updated session with user data:", session);

            return session;
        }
},

secret: process.env.NEXTAUTH_SECRET,
  //  console.log("Set secret for NextAuth from environment variables. This is used for signing and encrypting tokens.");

pages: {
    signIn: "/login",
        error: '/auth/error',
    },
//console.log("Configured custom pages for sign-in and error.");
};
