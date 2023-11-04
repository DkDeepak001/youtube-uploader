import { NextApiRequest, NextApiResponse } from "next";
import { oAuth2Client } from "~/server/api/utils";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { state: userID } = req.query;
    const { tokens } = await oAuth2Client.getToken({
      code: req.query.code as string,
      redirect_uri: "http://localhost:3000/api/google/auth",
    });

    oAuth2Client.setCredentials(tokens);

    await prisma.user.update({
      where: {
        id: userID as string,
      },
      data: {
        role: "OWNER",
        yt_access_token: tokens.access_token,
        yt_expiry_date: tokens.expiry_date,
        yt_refresh_token: tokens.refresh_token,
      },
    });

    res.send(`
      <html>
        <body>
          <script>
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error in OAuth2 handler:", error);
    res.status(500).send("Internal Server Error");
  }
}
