import User from "../models/user.js";
import randomString from "randomstring";
import config from "../config/config.js";
import nodemailer from "nodemailer";
import authController from "../middlewarecontroller/authController.js";

const userController = {
	//GET ALL USERS
	getAllUsers: async (req, res) => {
		try {
			const user = await User.find({}, { password: 0 });
			res.status(200).json(user);

		} catch (err) {
			res.status(500).js(err);
			// console.log(err);
		}
	},

	//DELETE USER
	deleteUser: async (req, res) => {
		try {
			const user = await User.findById(req.params.id);
			res.status(200).json("Delete Successfully!");
		} catch (err) {
			res.status(500).json("CAUSED ERROR");
		}
	},

	//UPDATE USER
	updateUser: async (req, res) => {
		try {

			const user_id = req.params.id;
			const password = req.password;

			const data = await User.findOne({ _id: user_id });

			if (data) {
				const newPassword = await authController.securePassword(password);

				const userData = await User.findByIdAndUpdate({ _id: user_id }, { $set: password });

				res.status(200).json("Your password has been updated successfully");

			}
			else {
				res.status(200).json("User ID not found");
			}

		} catch (err) {
			res.status(400).json("Error updating");
		}
	},

	//FORGET PASSWORD
	forgetPassword: async (req, res) => {
		try {
			const email = req.body.email;
			const userData = await User.findOne({ email: email });
			// res.status(200).json(userData);
			// console.log(email);
			try {
				if (userData) {
					const randomStringToken = randomString.generate();
					const data = await User.updateOne({ email: email }, { $set: { token: randomStringToken } });
					userController.sendResetPasswordMail(userData.username, userData.email, randomStringToken);
					res.status(200).json("Please check your inbox of mail to reset your password.");
				}
				else {
					res.status(200).json("This email does not exist.");
				}
			} catch (err) {
				res.status(401).json("CAUSED ERROR");
			}

		}
		catch (err) {
			res.status(400).json(err);
		}
	},

	//SEND MAIL TO RESET PASSWORD
	sendResetPasswordMail: async (username, email, token) => {

		try {

			const transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 587,
				secure: false,
				requireTLS: true,
				auth: {
					user: config.emailUser,
					pass: config.emailPassword
				}
			});
			const mailOptions = {
				from: config.emailUser,
				to: email,
				subject: "For Reset Password",
				html: "<p>Hi " + username + ",Please copy the link and <a href=\"http://localhost:8000/v1/auth/reset?token=" + token + "\"> reset your password </p>"
			};
			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				}
				else {
					console.log("Mail has been sent -", info.response);
				}
			});


		} catch (err) {
			console.log("CAUSED ERROR");
		}
	},

	//RESET PASSWORD
	resetPasswordAPI: async (req, res) => {
		try {
			const token = req.query.token;
			const tokenData = await User.findOne({ token: token });
			if (tokenData) {
				const password = req.body.password;
				const newPassword = await authController.securePassword(password);
				const userData = await User.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: newPassword, token: "" } }, { new: true });
				res.status(200).json({ success: true, message: "User Password has been reset successfully!", data: userData });
			}
			else {
				res.status(200).json("The link has been expired");
			}
		} catch (err) {
			res.status(400).json("CAUSED ERROR");
		}
	},

	uploadSingleFile: async (req, res) => {
		console.log(req.file);
		res.status(200).json("Single file upload successfully");
		//outputSuc(res,"Single file upload successfully");
	},
	uploadMultipleFiles: async (req, res) => {
		console.log(req.files);
		res.status(200).json("Multiple files upload successfully");
	},
	//CREATE AVATAR USER
	createAvatar: async (req, res) => {
		//const buffer = await sharp(req.file.buffer).resize({ width: 200, height: 200 }).png().toBuffer()
		req.user.avatar = req.file.buffer;
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		await User(req.user).save(function () { });
		res.status(200).json("Add a avatar successfully !");
	},

	//DELETE AVATAR USER
	deleteAvatar: async (req, res) => {
		req.user.avatar = undefined;
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		await User(req.user).save(function () { });
		// await req.user.save()
		res.send("Delete successful !");
	},

	//GET AVATAR USER
	getAvatar: async (req, res) => {
		try {
			const user = await User.findById(req.params.id);
			if (!user || !user.avatar) {
				throw new Error("Failed");
			}
			res.set("Content-Type", "image/png");
			res.status(200).json(user.avatar);
		} catch (error) {
			res.status(404).json({ success: false, msg: error.message });
		}
	}
};

export default userController;