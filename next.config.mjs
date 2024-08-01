



//const config = require("./config");
import config from "./config.js";
/** @type {import('next').NextConfig} */

//⨯ MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined".




const nextConfig = {




    env: {
        DB_URI: config.DB_URI,
        NEXTAUTH_SECRET: config.NEXTAUTH_SECRET,
        API: config.API,

        DOMAIN: config.DOMAIN,
        CLOUDINARY_CLOUD_NAME: config.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: config.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: config.CLOUDINARY_API_SECRET



    },
};

export default nextConfig;

