import mongoose from 'mongoose';
const contactSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Missing contact email'],
		},
		phone: {
			type: Number,
			required: [true, 'Missing contact phone'],
		},
		text: {
			type: String,
			required: [true, 'Missing contact text'],
		},
	},
	{
		timestamps: true,
	}
);
export default mongoose.model('Contact', contactSchema);
