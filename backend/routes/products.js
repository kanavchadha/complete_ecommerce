import express from 'express';
const router = express.Router();
import Product from '../models/product';
import { isAuth, isAdmin } from '../middleware/Auth';
import multer from 'multer';


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png' || ext !== '.jpeg') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

router.post("/uploadImage", isAuth, isAdmin, (req, res) => {
    try{
        upload(req, res, err => {
            if (err) {
                return res.json({ success: false, err })
            }
            const imagePath = res.req.file.path.replace('\\','/');
            return res.json({ success: true, image: imagePath, fileName: res.req.file.filename })
        })
    } catch(err){
        console.log('Error in uploading Image! '+err.message);
    }
    
});


router.get("/", async (req, res) => {
    try {
        const category = req.query.category ? { category: req.query.category } : {};
        const rateFilter = req.query.rateFilter ? { rating: {$gt: Number(req.query.rateFilter)} } : {};
        const range = req.query.priceFilter ? req.query.priceFilter.split(',') : [0,5000];
        const priceFilter = req.query.priceFilter ? { price: {$gt: Number(range[0]), $lt: Number(range[1])} } : {};
        const searchKeyword = req.query.searchKeyword
            ? {
                name: {
                    $regex: req.query.searchKeyword,
                    $options: 'i',
                },
            }
            : {};
        
        let sortOrder = {createdAt: -1};
        if(req.query.sortOrder){
            if(req.query.sortOrder === 'lowest') sortOrder = { price: 1 };
            if(req.query.sortOrder === 'highest') sortOrder = { price: -1 };
            if(req.query.sortOrder === 'highRated') sortOrder = { rating: -1 };
        }
        const products = await Product.find({ ...category, ...searchKeyword, ...rateFilter, ...priceFilter}).sort(sortOrder);
        res.send(products);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "Something went wrong!" });
    }
});

router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.status(200).send(product);
    } else {
        res.status(404).send({ msg: "Product Not Found!!" });
    }
})

router.post("/", isAuth, isAdmin, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        brand: req.body.brand,
        category: req.body.category,
        countInStock: req.body.countInStock,
        description: req.body.description,
        rating: req.body.rating,
        reviews: req.body.reviews
    })

    const newProd = await product.save();
    if (newProd) {
        return res.status(201).send({ message: 'new product created', data: newProd });
    }
    return res.status(500).send({ message: 'Error in creating product!' });
});

router.post('/:id/reviews', isAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            const review = {
                name: req.body.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            product.reviewsCont.push(review);
            product.reviews = product.reviewsCont.length;
            product.rating =
                product.reviewsCont.reduce((a, c) => c.rating + a, 0) /
                product.reviewsCont.length;
            const updatedProduct = await product.save();
            res.status(201).send({
                data: updatedProduct.reviewsCont[updatedProduct.reviews.length - 1],
                message: 'Review saved successfully.',
            });
        } else {
            res.status(404).send({ message: 'Product Not Found!' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Something went wrong!' });
    }

});

router.put("/:id", isAuth, isAdmin, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = req.body.name;
        product.image = req.body.image;
        product.price = req.body.price;
        product.brand = req.body.brand;
        product.category = req.body.category;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;

        const updatedProd = await product.save();
        if (updatedProd) {
            return res.status(200).send({ message: 'product updated', data: updatedProd });
        }
        return res.status(500).send({ message: 'Error in updating product!' });

    }
    return res.status(404).send({ message: 'Product Not Found!' });

});

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        return res.status(200).send({ message: 'product deleted' });
    }
    return res.status(404).send({ message: 'Product Not Found!' });

});

export default router;