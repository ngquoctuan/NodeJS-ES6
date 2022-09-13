import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
const privateKey = fs.readFileSync("./private.key", "utf8");

let refreshTokens = [];

const authController = {

	//HASHING PASSWORD
	securePassword: async (password) => {
		try {
			const salt = await bcrypt.genSalt(10);
			const passwordHashed = await bcrypt.hash(password, salt);
			return passwordHashed;
		} catch (err) {
			throw console.log(err);
		}

	},
	// REGISTER
	registerUser: async (req, res) => {
		try {
			const doesExitUsername = await User.findOne({ username: req.body.username });
			if (doesExitUsername)
				throw res.status(400).json("username has already been registered");
			const doesExitEmail = await User.findOne({ email: req.body.email });
			if (doesExitEmail)
				throw res.status(400).json("email has already been registered");
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(req.body.password, salt);

			//Create new user
			const newUser = await new User({
				username: req.body.username,
				email: req.body.email,
				password: hashed,
			});
			//Save user to DB
			const user = await newUser.save();
			res.status(200).json(user);
		} catch (err) {
			res.status(500).json(err);
		}
	},

	//GENERATE ACCESS TOKEN
	generateAccessToken: (user) => {
		return jwt.sign({
			id: user.id,
			email: user.email,
			admin: user.admin,
		},
		privateKey,
		{ expiresIn: "30m", algorithm: "RS256" }
		);
	},

	//GENERATE REFRESH TOKEN
	generateRefreshToken: (user) => {
		return jwt.sign({
			id: user.id,
			admin: user.admin,
		},
		privateKey,
		{ expiresIn: "365d", algorithm: "RS256" }
		);
	},
	//LOGIN
	loginUser: async (req, res) => {
		try {
			const user = await User.findOne({ username: req.body.username });
			if (!user) {
				res.status(404).json("Wrong username");
			}
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);
			if (!validPassword) {
				res.status(404).json("Wrong password");
			}
			if (user && validPassword) {
				const accessToken = authController.generateAccessToken(user);
				const refreshToken = authController.generateRefreshToken(user);
				refreshTokens.push(refreshToken);
				res.cookie("refreshToken", refreshToken, {
					httpOnly: false,
					secure: false,
					path: "/",
					sameSite: "strict"
				});
				const { password, ...others } = user._doc;
				res.status(200).json({ ...others, accessToken });
			}
		} catch (err) {
			res.status(500).json("CAUSED ERROR");
		}
	},

	//REFRESH TOKEN FROM TOKEN SAVED IN COOKIES
	reqRefreshToken: async (req, res) => {
		// TAKE REFRESH TOKEN FROM USER 
		const refreshToken = req.cookies.refreshToken;
		//Send error if token is not valid
		if (!refreshToken) return res.status(401).json("You're not authenticated!");
		if (!refreshTokens.includes(refreshToken)) {
			return res.status(403).json("Refresh token is not valid");
		}
		jwt.verify(refreshToken, process.env.alternativeSecretKey, (err, user) => {
			if (err) {
				console.log("ERROR JSON VERIFYING");
			}
			refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
			//CREATE NEW ACCESS TOKEN, REFRESH TOKEN
			const newAccessToken = authController.generateAccessToken(user);

			const newRefreshToken = authController.generateRefreshToken(user);

			refreshTokens.push(newRefreshToken);
			res.cookie("refreshToken", refreshToken, {
				httpOnly: false,
				secure: false,
				path: "/",
				sameSite: "strict"
			});
			res.status(200).json({ accessToken: newAccessToken });
		});
		//refreshToken: newRefreshToken 
	},

	//LOG OUT
	userLogout: async (req, res) => {
		res.clearCookie("refreshToken");
		refreshTokens = refreshTokens.filter(token => token != req.cookies.refreshToken);
		res.status(200).json("Log out Successfully");

	},

};

export default authController;