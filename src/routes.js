import { Router } from 'express';

import CustomerController from './app/controllers/CustomerController';
import SessionController from './app/controllers/SessionController';
import WishlistController from './app/controllers/WishListController';

import validateCustomerStore from './app/validators/CustomerStore';
import validateSessionStore from './app/validators/SessionStore';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/customer', validateCustomerStore, CustomerController.store);

routes.post('/login', validateSessionStore, SessionController.store);

routes.use(authMiddleware);

routes.get('/customer', CustomerController.show);
routes.put('/customer', CustomerController.update);
routes.delete('/customer', CustomerController.delete);

routes.get('/wishlist', WishlistController.index);
routes.put('/wishlist/:product_id', WishlistController.update);
routes.delete('/wishlist', WishlistController.delete);

export default routes;
