import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getTransporter } from "../utils/nodemailerClient.js";

// @desc    contact admin
// @route   POST /api/v1/contact
const contactController = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, phone, details } = req.body;

        const transporter = getTransporter();

        let mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: `Contact Us - ${name} - ${phone}`,
            text: details,
        };

        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json(new ApiResponse(200, {
            messageId: info.messageId,
            response: info.response
        }, "email sent"));
    } catch (error) {
        return next(new ApiError(400, "Email not sent"));
    }
});

export { contactController }