import express from "express";
import nodemailer from "nodemailer";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    return res.json({
        status: true
    })
});

app.post("/contact", (req, res) => {

    const { name, email, phone, details } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        }
    });

    let mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: `Contact Us - ${name} - ${phone}`,
        text: details,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.json({
                success: false,
                statusCode: 400,
                "message": info.response
            })
        } else {
            console.log('Email sent: ' + info.response);
            return res.json({
                success: true,
                statusCode: 200,
                "message": info.response
            })
        }
    });

})

app.listen(PORT, () => {
    console.log(`Server Started ...`);
});
