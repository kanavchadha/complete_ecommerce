import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
},{
    timestamps: true,
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: Array, default: [],required: true },
    price: { type: Number, required: true },
    brand: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    reviews: { type: Number, required: true, default: 0 },
    reviewsCont: [reviewSchema],
},{
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)
export default Product;