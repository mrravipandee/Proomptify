"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
};
const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Proomptify" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "🔐 Verify Your Email - Proomptify",
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .content p {
              color: #555;
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .otp-box {
              background-color: #f8f9fa;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              margin: 0;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #888;
              font-size: 14px;
            }
            .warning {
              color: #dc3545;
              font-size: 14px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Proomptify</h1>
            </div>
            <div class="content">
              <h2>Email Verification</h2>
              <p>Thank you for signing up! Please use the code below to verify your email address.</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code</p>
                <p class="otp-code">${otp}</p>
              </div>
              
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              <p class="warning">⚠️ If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Proomptify. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email} - Message ID: ${info.messageId}`);
    }
    catch (error) {
        console.error("❌ Email sending failed:", error.message);
        throw new Error("Failed to send verification email");
    }
};
exports.sendOTPEmail = sendOTPEmail;
