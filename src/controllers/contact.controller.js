import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getTransporter } from "../utils/nodemailerClient.js";


function createContactUsTemplate({ name, phone, details }) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .header { margin-bottom: 20px; }
                .header h1 { margin: 0; }
                .message { white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Contact Us Query</h1>
                </div>
                <div class="content">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <div class="message">
                        <strong>Message:</strong>
                        <p>${details}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

function createThankYouTemplate({ name }) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; color: #333; }
                .container { background-color: #fff; margin: 20px auto; padding: 20px; max-width: 600px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .header { color: #444; margin-bottom: 20px; }
                .header h1 { color: #333; }
                .content { margin-top: 20px; }
                .footer { margin-top: 40px; font-size: 0.9em; text-align: center; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank You, ${name}!</h1>
                </div>
                <div class="content">
                    <p>We have received your message and appreciate you reaching out to us. One of our team members will get back to you as soon as possible.</p>
                    <p>If you have any more questions, feel free to reply to this email. We're here to help you.</p>
                </div>
                <div class="footer">
                    <p>Best Regards,</p>
                    <p>The AlphaHood Team</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// @desc    contact admin
// @route   POST /api/v1/contact
const contactController = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, phone, details } = req.body;

        const transporter = getTransporter();

        const htmlContent = createContactUsTemplate({
            name,
            phone,
            details
        });

        // mail send to owner
        let mailOptions = {
            from: email,
            to: process.env.NODEMAILER_EMAIL,
            subject: `Contact Us Query`,
            // text: `${name} - ${phone} - ${details}`,
            html: htmlContent
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Failed to send email to owner:', error);
            return next(new ApiError(400, "Email not sent to owner"));
        }

        // if mail recieved to owner send mail to customer as a feedback

        const thankYouHtmlContent = createThankYouTemplate({
            name
        });

        mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: `AlphaHood Support`,
            // text: `Hi, ${name}! Thank you for contacting us. We will get back to you soon.`,
            html: thankYouHtmlContent
        };

        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json(new ApiResponse(200, {
            messageId: info.messageId,
            response: info.response
        }, "email sent"));
    } catch (error) {
        console.error('Failed to send contact email:', error);
        return next(new ApiError(500, "Internal Server Error"));
    }
});

export { contactController }