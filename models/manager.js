import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const managerSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Missing full name'],
    },
    password: {
      type: String,
      required: [true, 'Missing password '],
    },
    phone: {
      type: Number,
      required: [true, 'Missing Phone'],
      unique: true,
    },
    image: {
      type: String,
      required: false,
      default:
        'https://muallemy-storage.s3.eu-central-1.amazonaws.com/female.jpg',
    },
    email: {
      type: String,
      required: [true, 'Missing Email'],
      unique: true,
    },
    projects: [
      {
        project: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Projects',
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);
managerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

managerSchema.pre('save', async function (next) {
  // password are only hashed when they are modified or a new user is added
  this.fullName = this.fullName
    .split(' ')
    .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .join(' ');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
export default mongoose.model('Manager', managerSchema);
