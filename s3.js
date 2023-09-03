const fs = require("fs");
const S3rver = require("s3rver");

new S3rver({
  port: 9000,
  address: "0.0.0.0",
  directory: "./s3",

  configureBuckets: [
    {
      name: "upload-videos.localhost",
      configs: [fs.readFileSync("./cors.xml")],
    },
  ],
}).run((err, { address, port } = {}) => {
  if (err) {
    console.error(err);
  } else {
    console.log("now listening at address %s and port %d", address, port);
  }
});
