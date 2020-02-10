import Customer from '../schemas/Customer';
import Wishlist from '../schemas/Wishlist';

import Cache from '../../lib/Cache';

class CustomerController {
    async show(req, res) {
        const customer = await Customer.findById({ _id: req.userId });

        if (!customer)
            return res.status(404).json({
                message: 'Account not found, maybe it has been deleted.',
            });

        return res.json(customer);
    }

    async store(req, res) {
        const { name, email } = req.body;

        const emailExists = await Customer.findOne({
            email,
        });

        if (emailExists) {
            return res.status(400).json({ message: 'Email already used.' });
        }

        const { _id: id } = await Customer.create({
            name,
            email,
        });

        if (!id) {
            res.status(500).json({
                message: 'An error occurred while creating customer account.',
            });
        }

        await Wishlist.create({
            customer_id: id,
        });

        return res.status(201).json({ name, email });
    }

    async update(req, res) {
        const { name, email } = req.body;

        const customer = await Customer.findByIdAndUpdate(
            req.userId,
            {
                name,
                email,
            },
            { new: true }
        );

        if (!customer) {
            res.status(500).json({
                message: 'An error occurred while updating customer account.',
            });
        }

        return res.json({ message: 'User updated succesfully.' });
    }

    async delete(req, res) {
        const cached = await Cache.get(`customer:${req.userId}:wishlist:1`);

        if (cached) {
            await Cache.invalidatePrefix(`customer:${req.userId}:wishlist`);
        }

        await Wishlist.deleteOne({ customer_id: req.userId });

        await Customer.deleteOne({ _id: req.userId });

        return res.json({ message: 'Customer deleted succesfully.' });
    }
}

export default new CustomerController();
