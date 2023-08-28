import formidable, { errors as formidableErrors } from "formidable";
import { type NextApiRequest, type NextApiResponse } from "next";
import fs from "fs";
import { oAuth2Client, youtube } from "~/server/api/utils";
import { prisma } from "~/server/db";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userid } = req.query;
  const form = formidable({});
  let fields;
  let files;

  try {
    [fields, files] = await form.parse(req);
    const user = await prisma.user.findUnique({
      where: {
        id: userid as string,
      },
    });
    oAuth2Client.setCredentials({
      access_token: user?.yt_access_token,
      refresh_token: user?.yt_refresh_token,
      expiry_date: user?.yt_expiry_date,
    });

    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: fields?.title[0]!,
          description: fields?.description[0]!,
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
      media: {
        body: fs.createReadStream(files.file[0].filepath),
      },
    });
    return res.status(200).json(response.data);
  } catch (err) {
    if (err) {
    }
    console.error(err);
    return res.status(500).json(err);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
