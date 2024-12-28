import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    password: { type: String, required: [true, 'Password is required'] },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// userSchema.pre('save', async function (next) {
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.bcrypt_salt_rounds),
//   );
//   next();
// });

userSchema.pre('save', async function (next) {
  // Hash the password before saving
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  // Log the role for debugging
  console.log('Role in pre-save:', this.role);

  // Set the role if not provided (it defaults to 'user' if not explicitly set)
  if (!this.role) {
    this.role = 'user'; // Ensure 'user' is the default if role is missing
  }

  next();
});

userSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});

// userSchema.pre('save', function (next) {
//   console.log('Role in pre-save:', this.role); // Check what the role is here
//   next();
// });

userSchema.statics.isUserEmailExists = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

// Define a static method to check if the password is matched
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
