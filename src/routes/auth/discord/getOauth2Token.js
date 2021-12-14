import fetch from "node-fetch";

export default async (req, res, next) => {
  const { code, error } = req.query;
  if (error)
    return res.redirect(`${process.env.CLIENT_DOMAIN}/login?error=${error}`);

  console.log("code", code);

  if (!code)
    return next({
      statusCode: 400,
      code: "auth/discord/noAuthCodeProvided",
      message: "Không có mã xác thực đăng nhập!",
    });

  try {
    const discordResponse = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: process.env.DISCORD_REDIRECT_URI,
          scope: "identify email",
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const oauth2Result = await discordResponse.json();

    const { access_token: accessToken, token_type: tokenType } = oauth2Result;
    console.log(accessToken);
    console.log(oauth2Result);
    if (!accessToken)
      return next({
        statusCode: 400,
        code: "auth/discord/invalidCode",
        message: "Mã xác thực không hợp lệ!",
      });

    req.accessToken = accessToken;
    req.tokenType = tokenType;
    next();
  } catch (error) {
    // NOTE: An unauthorized token will not throw an error;
    // it will return a 401 Unauthorized response in the try block above
    next(error);
  }
};
