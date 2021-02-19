import mongoose from 'mongoose';
const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Missing Title'],
    },
    duration: {
      type: Number,
      required: [true, 'Missing Duration'],
      validate: {
        validator: function () {
          return this.duration >= 0;
        },
      },
    },
    starting_date: {
      type: Date,
      required: [true, 'Missing Starting Date'],
      validate: {
        validator: function () {
          return this.starting_date >= Date.now;
        },
      },
    },
  },
  {
    timestamps: true,
  }
);
projectSchema.pre('save', async function (next) {
  this.title = this.title
    .split(' ')
    .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .join(' ');
  next();
});
export default mongoose.model('Projects', projectSchema);
