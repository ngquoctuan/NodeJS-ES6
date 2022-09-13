import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			require: true,
			min: 6,
			max: 20,
			unique: true,
		},
		email: {
			type: String,
			require: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			require: true,
			min: 6,
		},
		admin: {
			type: Boolean,
			default: false,
		},
		token: {
			type: String,
			default: ""
		},
		avatar: {
			type: Buffer //vung luu tru du lieu tam thoi thuong duoc luu tru trong bo nho Ram
		}
	},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema);