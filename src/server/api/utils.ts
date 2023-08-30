import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import S3 from "aws-sdk/clients/s3";

export const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export const youtube = google.youtube({
  version: "v3",
  auth: oAuth2Client,
});

export const s3Client = new S3({
  apiVersion: "2006-03-01",
  region: "us-east-1",
  endpoint: "http://localhost:9000",
  credentials: {
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER",
  },
  signatureVersion: "v4",
});
