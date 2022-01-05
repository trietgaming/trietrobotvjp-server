import jwt from "jsonwebtoken";
import transporter from "./transporter.js";

export default ({ email, password, displayName }) => {
    const verifyToken = jwt.sign(
        {
            email,
            password,
            displayName,
        },
        process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
        { expiresIn: 300 }
    );
    const registerLink = `${process.env.DOMAIN}/auth/register/verify?token=${verifyToken}`;

    return transporter.sendMail({
        from: "TrietRobotVjp Account <noreply@trietrobotvjp.com>",
        to: email,
        subject: "Hoàn tất đăng ký tài khoản " + email,
        html: `<!DOCTYPE html><html lang="vi"> <head> <title></title> <meta charset="utf-8"/> <meta content="width=device-width, initial-scale=1.0" name="viewport"/> </head> <body> <table> <tr> <td> <td id="root" style=" max-width: 550px; height: 800px; font-family: Arial, Helvetica, sans-serif; border-radius: 10px; " > <table> <tr> <td><td style="margin: 0 4em"> <table style="width: auto; margin: 0 auto"><tr><td> <td> <table> <tr> <td style="display: flex;"><img alt="logo" style="border-radius: 10px" width="50" height="50" src="https://drive.google.com/uc?id=13BuOrQ_upjNlwROE4x9YGv3xiD4o2sie"/> <h3 style="padding-left: 0.7em">TrietRobotVjp</h3></td></tr></table> </td></td></tr></table> <h2 style="margin: 40px 0; text-align: center"> Xin chào ${displayName}! </h2> <p> Địa chỉ email này của bạn vừa được sử dụng để yêu cầu đăng ký một tài khoản mới trên ứng dụng của chúng tôi. Để hoàn tất đăng ký một tài khoản mới trên TrietRobotVjp, vui lòng nhấn vào nút dưới đây. </p><table> <tr> <td>Tên người dùng:</td><td>${displayName}</td></tr><tr> <td>Email:</td><td>${email}</td></tr><tr> <td>Mật khẩu:</td><td>••••••••••</td></tr></table> <a style="text-decoration: none" href="${registerLink}" ><table style="margin: 50px auto 80px auto;"><tr><td><td style=" background-color: #0f4afa; color: white; width: 300px; height: 50px; border-radius: 30px; " > <h3 style="text-align: center"> Xác nhận đăng ký </h3> </td></td></tr></table></a > <p>Nếu bạn không yêu cầu đăng ký, bạn có thể bỏ qua email này.</p><br/> <p style="color: gray">Cảm ơn bạn,</p><p style="color: gray">TrietRobotVjp Team</p></td></td></tr></table> </td></td></tr></table> </body></html>`
    });
};
