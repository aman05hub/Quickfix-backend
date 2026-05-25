const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

console.log("PUBLIC:", process.env.IMAGEKIT_PUBLIC_KEY);
console.log("PRIVATE:", process.env.IMAGEKIT_PRIVATE_KEY ? "EXISTS" : "MISSING");
console.log("URL:", process.env.IMAGEKIT_URL_ENDPOINT);

module.exports = imagekit;