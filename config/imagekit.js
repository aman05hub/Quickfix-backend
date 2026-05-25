const ImageKit = require("imagekit");
require("dotenv").config();

console.log("Public Key:", process.env.IMAGEKIT_PUBLIC_KEY);
console.log("Private Key:", process.env.IMAGEKIT_PRIVATE_KEY ? "EXISTS" : "MISSING");
console.log("URL Endpoint:", process.env.IMAGEKIT_URL_ENDPOINT);

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


module.exports = imagekit;