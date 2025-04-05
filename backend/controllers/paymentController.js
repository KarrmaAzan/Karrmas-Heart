import stripe from '../config/stripe.js';

export const createCheckoutSession = async (req, res, next) => {
  const { priceId } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`
    });
    res.json({ id: session.id });
  } catch (error) {
    next(error);
  }
};
 