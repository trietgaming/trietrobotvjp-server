import fetch from "node-fetch";

export default async (req, res, next) => {
  if (!req.accessToken || !req.tokenType) return next("something went wrong");
  try {
    const userResult = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${req.tokenType} ${req.accessToken}`,
      },
    });
    req.discordUser = await userResult.json();
    next();
  } catch (err) {
    next(err);
  }
};
