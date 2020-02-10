import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema(
    {
        customer_id: mongoose.ObjectId,
        list: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Wishlist', WishlistSchema);
