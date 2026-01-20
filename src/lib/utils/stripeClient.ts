import Stripe from 'stripe';

const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
	console.warn('Stripe secret key not found. Stripe features will not work.');
}

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
	apiVersion: '2025-12-15.clover',
	typescript: true,
}) : null;

export function getStripePublishableKey(): string {
	const key = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
	if (!key) {
		throw new Error('Stripe publishable key not found');
	}
	return key;
}

export function isStripeConfigured(): boolean {
	return !!stripe && !!import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
}
