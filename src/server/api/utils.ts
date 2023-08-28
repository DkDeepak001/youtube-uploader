import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

// export const oauth2Client = new google.auth.OAuth2({
//   clientId: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   redirectUri: process.env.GOOGLE_REDIRECT_URI,
// });

export const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export const youtube = google.youtube({
  version: "v3",
  auth: oAuth2Client,
});
