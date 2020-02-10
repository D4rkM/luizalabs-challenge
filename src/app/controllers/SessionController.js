import jwt from 'jsonwebtoken';

import Customer from '../schemas/Customer';

import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { email } = req.body;

        const { _id: id } = await Customer.findOne({
            email,
        }).select('_id');

        if (!id)
            return res.status(404).json({ message: 'Customer not found.' });

        return res.json({
            token: jwt.sign(
                {
                    id,
                },
                authConfig.secret,
                {
                    expiresIn: authConfig.expiresIn,
                }
            ),
        });
    }
}

export default new SessionController();
