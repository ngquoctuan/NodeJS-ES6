import Product from "../models/Product.js";

const productController = {
	getAllProducts: async (req, res) => {
		try {
			const product = await Product.find();
			res.status(200).json(product);

		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getProductID: async (req, res) => {
		try {
			const product = await Product.findById(req.params.id);
			if (!product)
				return res.status(404).json({ msg: "Not found" });
			else return res.status(200).json(product);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	addAProduct: async (req, res) => {
		try {
			const { title, image, description, category, price } = req.body;
            
			const product = new Product(req.body).save();
			return res.status(200).json(product);

		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	updateProduct: async (req, res) => {
		try {
			const { title, image, description, category, price } = req.body;
			const product = await Product.findByIdAndUpdate(req.params.id, {
				title, image, description, category, price
			}, { new: true }//de tra ve gia tri moi
			);
			if (!product)
				return res.status(404).json({ msg: "Not found the product" });
			return res.status(200).json(product);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	deleteProduct: async (req, res) => {
		try {

			const product = await Product.findByIdAndDelete(req.params.id);

			if (!product)
				return res.status(404).json({ msg: "Not found" });

			return res.status(200).json({ msg: "Delete Success" });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
    
};

export default productController;