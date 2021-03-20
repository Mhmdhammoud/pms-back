import mongoose from 'mongoose';
const projectSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Missing Title'],
			unique: true,
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
		description: {
			type: String,
		},
		startingDate: {
			type: String,
			required: [true, 'Missing Starting Date'],
		},
		image: {
			type: String,
			default:
				'https://images-ext-2.discordapp.net/external/aK_uXpe4Difh3zV3MpYkzrd0om8X5mbrqEeuxhkZZwc/https/www.andreasreiterer.at/wp-content/uploads/2017/11/react-logo-825x510.jpg',
		},
		projectManager: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Manager',
		},
		projectEmployees: [
			{
				employeeID: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Employee',
				},
			},
		],
		milestones: [
			{
				msTitle: {
					type: String,
				},
				endingDate: {
					type: String,
				},
				achieved: {
					type: Boolean,
					default: false,
				},
			},
		],
		tasks: [
			{
				title: {
					type: String,
				},
				description: {
					type: String,
				},
				status: {
					type: String,
					default: 'In Progress',
				},
				employeeID: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Employee',
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
					type: String,
				},
				managerComments: [
					{
						text: String,
						manager: {
							type: mongoose.Schema.Types.ObjectId,
							ref: 'Manager',
						},
						createdAt: {
							type: Date,
							default: Date.now,
						},
					},
				],
				employeesComments: [
					{
						text: String,
						employee: {
							type: mongoose.Schema.Types.ObjectId,
							ref: 'Employee',
						},
						createdAt: {
							type: Date,
							default: Date.now,
						},
					},
				],
				startingDate: {
					type: String,
				},
				managerFiles: [
					{
						src: String,
						fileName: String,
						createdAt: {
							type: Date,
							default: Date.now,
						},
						manager: {
							type: mongoose.Schema.Types.ObjectId,
							ref: 'Manager',
						},
					},
				],
				employeeFiles: [
					{
						src: String,
						fileName: String,
						createdAt: {
							type: Date,
							default: Date.now,
						},
						employee: {
							type: mongoose.Schema.Types.ObjectId,
							ref: 'Employee',
						},
					},
				],
			},
		],
		news: [
			{
				title: String,
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		managerFiles: [
			{
				src: String,
				fileName: String,
				createdAt: {
					type: Date,
					default: Date.now,
				},
				manager: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Manager',
				},
			},
		],
		employeeFiles: [
			{
				src: String,
				fileName: String,
				createdAt: {
					type: Date,
					default: Date.now,
				},
				employee: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Employee',
				},
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
