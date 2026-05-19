const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadfile(file) {
  try {
    const result = await imagekit.upload({
      file: file,
      fileName: `music-${Date.now()}.mp3`,
      folder: "/music",
    });

    return result;

  } catch (error) {
    console.log("IMAGEKIT ERROR:", error);
    throw error;
  }
}

module.exports = {
  uploadfile,
};