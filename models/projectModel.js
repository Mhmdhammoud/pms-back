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
    startingDate: {
      type: Date,
      required: [true, 'Missing Starting Date'],
      validate: {
        validator: function () {
          return this.starting_date >= Date.now;
        },
      },
    },
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
    },
    projectEmployees: [
      {
        employeeID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Employees',
        },
      },
    ],
    milestones: [
      {
        msTitle: {
          type: String,
        },
        endingDate: {
          type: Date,
          validate: {
            validator: function () {
              return this.ending_date >= Date.now;
            },
          },
        },
      },
    ],
    tasks: [
      {
        taskTitle: {
          type: String,
        },
        employeeID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Employees',
        },
        duration: {
          type: Number,
          validate: {
            validator: function () {
              return this.duration > 0;
            },
          },
        },
        deadline: {
          type: Date,
          validate: {
            validator: function () {
              return this.deadline >= Date.now;
            },
          },
        },
        comments: [
          {
            text: String,
            ownerName: String,
            onwerImage: String,
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        startingDate: {
          type: Date,
          validate: {
            validator: function () {
              return this.startingDate > Date.now;
            },
          },
        },
        files: [
          {
            URL: String,
            createdAt: {
              type: Date,
              default: Date.now,
            },
            ownerName: String,
            ownerImage: String,
            ownerImage: String,
          },
        ],
      },
    ],
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
