// config/stripe.js
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from './env.js'; // load env properly

const stripe = new Stripe(STRIPE_SECRET_KEY);
export default stripe;
