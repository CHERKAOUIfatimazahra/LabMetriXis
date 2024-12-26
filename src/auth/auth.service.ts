import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as crypto from 'crypto';
import { User } from '../schemas/user.schema';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // Register new user
  async register(email: string, password: string, role: string = 'Researcher') {
    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    // Create new user
    const user = new this.userModel({
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: verificationExpires,
      role, // Assign role here
    });

    await user.save();

    // Send verification email
    await this.mailService.sendVerificationEmail(email, verificationToken);

    return { message: 'Registration successful. Please verify your email.' };
  }

  // Verify email
  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  // Login
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    if (user.is2FAEnabled) {
      // Generate OTP for 2FA
      const otp = this.generateOTP();
      user.otpSecret = otp.secret;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send OTP via email
      await this.mailService.sendOTP(user.email, otp.token);

      return { message: 'Please enter OTP sent to your email' };
    }

    // Generate JWT if 2FA is not enabled
    return this.generateTokens(user);
  }

  // Verify 2FA OTP
  async verifyOTP(email: string, otp: string) {
    const user = await this.userModel.findOne({
      email,
      otpExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: 'base32',
      token: otp,
      window: 6, // 3 minutes window
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP data
    user.otpSecret = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT after successful 2FA
    return this.generateTokens(user);
  }

  // Enable 2FA for user
  async enable2FA(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    user.is2FAEnabled = true;
    await user.save();

    return { message: '2FA enabled successfully' };
  }

  // Generate OTP
  private generateOTP() {
    const secret = speakeasy.generateSecret().base32;
    const token = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
    });

    console.log('Generated OTP:', token); // Log OTP for debugging
    return { secret, token };
  }

  // Generate JWT tokens
  private generateTokens(user: User) {
    const payload = { email: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  // Reset password with 2FA
  async resetPassword(email: string, newPassword: string, otp: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify OTP for password reset
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: otp,
      window: 6, // 3 minutes window
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password reset successfully' };
  }
}
