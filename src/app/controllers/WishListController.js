import axios from 'axios';

import Wishlist from '../schemas/Wishlist';

import Cache from '../../lib/Cache';
import productAPIConfig from '../../config/productAPI';
import wishlistConfig from '../../config/wishlist';

class WishlistController {
    async index(req, res) {
        const page = parseInt(req.query.page, 10) || 1;

        const cacheKey = `customer:${req.userId}:wishlist:${page}`;

        const cached = await Cache.get(cacheKey);

        if (cached) {
            return res.json(cached);
        }

        const wishlist = await Wishlist.findOne({ customer_id: req.userId });

        if (!wishlist)
            return res.status(404).json({
                message: 'There is no wishlist for this account yet.',
            });

        const pagedWishlist = wishlist.list.slice(
            (page - 1) * wishlistConfig.page_limit,
            page * wishlistConfig.page_limit
        );

        const list = [];

        for (let i = 0; i < pagedWishlist.length; i += 1) {
            const product =
                // eslint-disable-next-line no-await-in-loop
                await axios.get(`${productAPIConfig.link + wishlist.list[i]}`);

            product.data.link = productAPIConfig.link + wishlist.list[i];

            list.push(product.data);
        }

        await Cache.set(cacheKey, list);

        return res.json(list);
    }

    async update(req, res) {
        const { product_id } = req.params;

        const { option } = req.query;

        const wishlist = await Wishlist.findOne({ customer_id: req.userId });

        if (!wishlist)
            return res.status(404).json({
                message: 'Wishlist not found, please create one first.',
            });

        switch (option) {
            case 'add': {
                const productInList = await wishlist.list.find(
                    product => product === product_id
                );

                if (productInList)
                    return res.status(400).json({
                        message:
                            'You already have this product in your Wishlist',
                    });

                try {
                    await axios.get(productAPIConfig.link + product_id);
                } catch (error) {
                    return res.status(404).json({
                        message:
                            'Product does not exists or has been removed from the store.',
                        error: error.message,
                    });
                }

                wishlist.list.push(product_id);

                await wishlist.save();

                break;
            }
            case 'remove': {
                wishlist.list.pull(product_id);

                await wishlist.save();
                break;
            }
            default: {
                return res
                    .status(400)
                    .json({ message: 'Option is not valid.' });
            }
        }

        const cached = await Cache.get(`customer:${req.userId}:wishlist:1`);

        if (cached) {
            await Cache.invalidatePrefix(`customer:${req.userId}:wishlist`);
        }

        return res.json(wishlist.list);
    }

    async delete(req, res) {
        const cached = await Cache.get(`customer:${req.userId}:wishlist:1`);

        if (cached) {
            await Cache.invalidatePrefix(`customer:${req.userId}:wishlist`);
        }

        await Wishlist.findOneAndUpdate(
            { customer_id: req.userId },
            { list: [] }
        );

        return res.json({ message: 'Wishlist deleted succesfully.' });
    }
}

export default new WishlistController();
