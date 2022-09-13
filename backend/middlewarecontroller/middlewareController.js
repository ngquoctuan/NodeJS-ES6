import jwt from "jsonwebtoken";
import authSchema from "./userValidate.js";
import fs from "fs";
const publicKey = fs.readFileSync("./public.key", "utf8");

const middlewareController = {

	//VERIFY TOKEN
	verifyToken: (req, res, next) => {
		const tokenTemp = req.headers.token;
        
		if (tokenTemp) {
			const token = tokenTemp.split(" ")[1];
			//  console.log(token);
			jwt.verify(token, publicKey, { algorithm: "RS256" }, (err, user) => {
				if (err) {
					res.status(403).json("Token is not valid");
				}
				req.user = user;
				next();
			}
			);
		}
		else {
			res.status(401).json("You're not authenticated");
		}
	},
	verifyTokenAndAdminAuth: async (req, res, next) => {
		middlewareController.verifyToken(req, res, () => {
			if (req.user.id == req.params.id || req.user.admin) {
				next();
			}
			else {
				res.status(403).json("You're not allowed to delete others");
			}
		});
	},
	validateInputUserAPI: async (req, res, next) => {
		try {
			const result = await authSchema.validateAsync(req.body);
			next();
		} catch (error) {
			const str = error.message;
			if (str.includes("username"))
				return res.status(400).json("username length must be at least 3 characters long");
			else
				return res.status(400).json("email must be a valid email");
			// return res.status(400).json({message: error.message});
		}
	}
};

export default middlewareController;