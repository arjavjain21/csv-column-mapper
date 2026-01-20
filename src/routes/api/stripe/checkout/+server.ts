import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/utils/stripeClient';
import { supabase } from '$lib/utils/supabaseClient';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		if (!stripe) {
			return json({ error: 'Stripe not configured' }, { status: 500 });
		}

		const { priceId, successUrl, cancelUrl } = await request.json();

		if (!priceId) {
			return json({ error: 'Price ID is required' }, { status: 400 });
		}

		// Get user session
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return json({ error: 'You must be logged in to subscribe' }, { status: 401 });
		}

		// Get user profile to check if customer exists
		const { data: profile } = await locals.supabase
			.from('user_profiles')
			.select('stripe_customer_id, email')
			.eq('id', user.id)
			.single();

		if (!profile) {
			return json({ error: 'User profile not found' }, { status: 404 });
		}

		let customerId = profile.stripe_customer_id;

		// Create Stripe customer if doesn't exist
		if (!customerId) {
			const customer = await stripe.customers.create({
				email: profile.email,
				metadata: {
					supabase_user_id: user.id
				}
			});

			customerId = customer.id;

			// Save customer ID to profile
			await locals.supabase
				.from('user_profiles')
				.update({ stripe_customer_id: customerId })
				.eq('id', user.id);
		}

		// Determine if this is a subscription or one-time payment
		const price = await stripe.prices.retrieve(priceId);

		const isSubscription = price.type === 'recurring';

		// Create checkout session
		const sessionParams: any = {
			customer: customerId,
			mode: isSubscription ? 'subscription' : 'payment',
			line_items: [
				{
					price: priceId,
					quantity: 1
				}
			],
			success_url: successUrl || `${import.meta.env.PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: cancelUrl || `${import.meta.env.PUBLIC_APP_URL}/pricing?canceled=true`,
			metadata: {
				supabase_user_id: user.id
			}
		};

		// Add trial for subscription plans
		if (isSubscription) {
			sessionParams.subscription_data = {
				trial_period_days: 14,
				metadata: {
					supabase_user_id: user.id
				}
			};
		}

		const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

		return json({
			sessionId: checkoutSession.id,
			url: checkoutSession.url
		});
	} catch (error) {
		console.error('Checkout session error:', error);
		return json({ error: 'Failed to create checkout session' }, { status: 500 });
	}
};
