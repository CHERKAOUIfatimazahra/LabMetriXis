// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // Changed from true to false
      requireTLS: true, // Added this option
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // For development only - remove in production
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    try {
      const verificationLink = `${process.env.APP_URL}/verify-email?token=${token}`;

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Verify your email for LabMetriXis',
        html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email:</p>
          <a href="${verificationLink}">${verificationLink}</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendOTP(email: string, otp: string) {
    try {
      console.log('Sending OTP to:', email);
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Your LabMetriXis 2FA Code',
        html: `
        <h1>Two-Factor Authentication Code</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
      });
      console.log('OTP sent successfully!');
    } catch (error) {
      console.error('OTP email sending error:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}
