/* eslint-disable no-const-assign */
import User from "../models/user.js";

import userController from "../controllers/userController.js";
const DEFAULT_MAX_SIZE = 100;

const feature = {
	//PAGINATION
	pagingFunc: async (req, res) => {
		const page = req.query.number;
		const PAGE_SIZE = req.query.size || DEFAULT_MAX_SIZE;
		console.log(page, PAGE_SIZE);
		if (page) {
			page = parseInt(page);
			PAGE_SIZE = parseInt(PAGE_SIZE);
			const numberSkip = (page - 1) * PAGE_SIZE;
			try {
				const data = await User.find().skip(numberSkip).limit(PAGE_SIZE);
				res.status(200).json(data);
			} catch (err) {
				res.status(500).json({ message: err.message });
			}
		} else {
			userController.getAllUsers();
		}
	},
	//SORT
	sortingFunc: async (req, res) => {
		const sort = req.query.sort || "-createdAt";
		console.log(sort);
		try {
			const user = await User.find().sort(sort);
			console.log(user);
			res.status(200).json(user);
		} catch (e) {
			res.status(500).json("CAUSED ERROR SORTING_FUNCTION");
		}

	},
	//SEARCH
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	searhingFunc: async (req, res, next) => {

	}
};

export default feature;