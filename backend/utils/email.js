import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Booking Confirmed : ${eventTitle}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9fafb;">

          <div style="background: #4f46e5; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0;">Eventure</h1>
          </div>

          <div style="background: #ffffff; padding: 25px; border-radius: 0 0 8px 8px;">

            <h2 style="color: #333;">🎉 Booking Confirmed!</h2>

            <p style="font-size: 16px; color: #555;">
              Hello <strong>${userName}</strong>,
            </p>

            <p style="font-size: 16px; color: #555;">
              Your booking has been successfully confirmed for the event:
            </p>

            <div style="
              background: #f3f4f6;
              padding: 15px;
              text-align: center;
              border-radius: 8px;
              margin: 20px 0;
            ">
              <h2 style="margin: 0; color: #4f46e5;">
                ${eventTitle}
              </h2>
            </div>

            <p style="font-size: 16px; color: #555;">
              Please make sure to arrive on time and carry any required ID or ticket confirmation.
            </p>

            <p style="font-size: 16px; color: #555;">
              We’re excited to have you at the event! 🚀
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

            <p style="font-size: 14px; color: #777;">
              If you have any questions, feel free to contact our support team.
            </p>

            <p style="font-size: 14px; color: #777;">
              Regards,<br />
              <strong>Eventure Team</strong>
            </p>

          </div>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`email successfully sent to ${userEmail}`);
  } catch (error) {
    console.log(`Error sending mail : ${error}`);
  }
};

export const sendOtpEmail = async (email, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "Verify your Eventure Account"
        : "Eventure Booking Verification";

    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventure account"
        : "Please use the following OTP to verify and confirm your event booking";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: title,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color: #4f46e5;">Email Verification</h2>

      <p>Hello,</p>

      <p>Your OTP for verification is:</p>

      <div style="
        background: #f3f4f6;
        padding: 15px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
      ">
        <h1 style="
          margin: 0;
          color: #4f46e5;
          letter-spacing: 5px;
        ">
          ${otp}
        </h1>
      </div>

      <p>This OTP is valid for 5 minutes.</p>

      <p>If you didn't request this OTP, you can ignore this email.</p>

      <p>Regards,<br><strong>Eventure Team</strong></p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP for email send to ${email} is ${otp}`);
  } catch (error) {
    console.log(`Error sending OTP email to ${email} for ${type}:`, error);
  }
};
