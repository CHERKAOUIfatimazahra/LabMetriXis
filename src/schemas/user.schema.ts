import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  is2FAEnabled: boolean;

  @Prop()
  twoFactorSecret: string;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  emailVerificationTokenExpires: Date;

  @Prop()
  otpSecret: string;

  @Prop()
  otpExpires: Date;

  @Prop({ enum: ['Admin', 'Researcher', 'Technician'], default: 'Researcher' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
