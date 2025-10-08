// backend/server/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: String,
    brand: String,
    type: String,        // e.g. 'keyboard', 'gpu', 'console'
    price: Number,
    url: String,         // affiliate or product page
    images: [String],
    specs: Object,       // free-form key/values
    status: { type: String, default: 'active' }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
