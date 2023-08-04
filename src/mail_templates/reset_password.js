const HTML_TEMPLATE = (text) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Email Title</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: white;
            }
    
            .content-cell {
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #8a8a8a;
                vertical-align: middle;
            }
    
            .content-cell * {
                vertical-align: middle;
                margin: 10px 0;
            }
        </style>
    </head>
    
    <body>
        <div class"black">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
                <tr>
                    <td align="center" valign="top" style="padding: 20px;">
                        <div
                            style="max-width: 600px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); margin: 0 auto;">
                            <div style="text-align: center; padding: 40px 0; height: 15%; color: #525252;">
                                <h1>Oops!</h1>
                            </div>
                            <table class="content-cell" width="100%">
                                <tr>
                                    <td style="padding: 0;">
                                        <p style="color: #8a8a8a;">It looks like you forgot your password. You can reset it
                                            using the button below.</p>
                                        <img src="cid:vector" alt="Vector" width="100px" height="100px">
                                        <a style="display:block; width: fit-content; margin: 10px auto; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;"
                                            href="${text}">Reset password</a>
                                        <p style="color: #a6a8b0;">If you didn't request a password reset, you can safely
                                            ignore this email.</p>
                                    </td>
                                </tr>
                            </table>
                            <div
                                style="text-align: center; font-size: 12px; padding: 20px 0; height: 15%; background-color: #333; color: #fff;">
                                <p>&copy; 2023 Your Company. All rights reserved.</p>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    
    </html>`;
}

module.exports = (text) => {
    return HTML_TEMPLATE(text);
}
