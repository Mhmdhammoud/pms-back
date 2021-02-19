import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = mongoose.Schema(
  {
    full_name: {
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
    },
    image: {
      type: String,
      required: false,
      defaut:
        'https://muallemy-storage.s3.eu-central-1.amazonaws.com/female.jpg',
    },
    email: {
      type: String,
      required: [true, 'Missing Email'],
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
employeeSchema.pre('save', async function (next) {
  // password are only hashed when they are modified or a new user is added
  this.full_name = this.full_name
    .split(' ')
    .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .join(' ');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
export default mongoose.model('Employee', employeeSchema);
