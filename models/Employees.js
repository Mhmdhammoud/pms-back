import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = mongoose.Schema(
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
				'https://images-ext-1.discordapp.net/external/c8kNf_KjKot7PbAXFV25Wuv2nePiRWamDejgVRLvf94/%3Fq%3Dtbn%3AANd9GcSH4dcYWVFHFsz8M3Rsjpy2Hg6gQAmgbCIwWA%26usqp%3DCAU/https/encrypted-tbn0.gstatic.com/images',
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
		tasks: [
			{
				title: String,
				projectTitle: String,
				deadline: String,
			},
		],
	},
	{timestamps: true}
);
employeeSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};
employeeSchema.pre('save', async function (next) {
	// password are only hashed when they are modified or a new user is added
	this.fullName = this.fullName
		.split(' ')
		.map((val) => val.charAt(0).toUpperCase() + val.slice(1))
		.join(' ');
	this.password = await bcrypt.hash(this.password, 12);
	next();
});
export default mongoose.model('Employee', employeeSchema);
