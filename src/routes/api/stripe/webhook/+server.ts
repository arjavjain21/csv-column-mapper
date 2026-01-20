import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/utils/stripeClient';
import { supabase } from '$lib/utils/supabaseClient';
import Stripe from 'stripe';

const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!stripe || !webhookSecret) {
			return json({ error: 'Stripe not configured' }, { status: 500 });
		}

		const body = await request.text();
		const signature = request.headers.get('stripe-signature');

		if (!signature) {
			return json({ error: 'No signature' }, { status: 400 });
		}

		// Verify webhook signature
		let event: Stripe.Event;
		try {
			event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
		} catch (err) {
			console.error('Webhook signature verification failed:', err);
			return json({ error: 'Invalid signature' }, { status: 400 });
		}

		console.log('Webhook received:', event.type);

		// Handle different event types
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;
				await handleCheckoutCompleted(session);
				break;
			}

			case 'customer.subscription.created':
			case 'customer.subscription.updated': {
				const subscription = event.data.object as Stripe.Subscription;
				await handleSubscriptionUpdate(subscription);
				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object as Stripe.Subscription;
				await handleSubscriptionDeleted(subscription);
				break;
			}

			case 'invoice.paid': {
				const invoice = event.data.object as Stripe.Invoice;
				console.log('Invoice paid:', invoice.id);
				break;
			}

			case 'invoice.payment_failed': {
				const invoice = event.data.object as Stripe.Invoice;
				await handlePaymentFailed(invoice);
				break;
			}

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return json({ error: 'Webhook handler failed' }, { status: 500 });
	}
};

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
	const userId = session.metadata?.supabase_user_id;
	const customerId = session.customer as string;

	if (!userId) {
		console.error('No user ID in session metadata');
		return;
	}

	// Save subscription ID if this is a subscription
	if (session.mode === 'subscription' && session.subscription) {
		// Set billing cycle anchor to current day (1-31)
		const billingCycleAnchor = new Date().getDate();

		await supabase
			.from('user_profiles')
			.update({
				stripe_customer_id: customerId,
				stripe_subscription_id: session.subscription as string,
				subscription_started_at: new Date().toISOString(),
				billing_cycle_anchor: billingCycleAnchor
			})
			.eq('id', userId);
	}

	// For one-time payments (lifetime), update tier immediately
	if (session.mode === 'payment') {
		await supabase
			.from('user_profiles')
			.update({
				subscription_tier: 'lifetime',
				stripe_customer_id: customerId
			})
			.eq('id', userId);
	}
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
	const customerId = subscription.customer as string;

	// Get user from Stripe customer ID
	const { data: profile } = await supabase
		.from('user_profiles')
		.select('id')
		.eq('stripe_customer_id', customerId)
		.single();

	if (!profile) {
		console.error('No profile found for customer:', customerId);
		return;
	}

	// Determine tier based on price
	const priceId = subscription.items.data[0].price.id;
	const tier = getTierFromPriceId(priceId);

	// Update user tier
	await supabase
		.from('user_profiles')
		.update({
			subscription_tier: tier,
			stripe_subscription_id: subscription.id
		})
		.eq('id', profile.id);

	console.log(`Updated user ${profile.id} to tier ${tier}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	const customerId = subscription.customer as string;

	// Downgrade user to free tier
	await supabase
		.from('user_profiles')
		.update({
			subscription_tier: 'free',
			stripe_subscription_id: null
		})
		.eq('stripe_customer_id', customerId);

	console.log(`Downgraded customer ${customerId} to free tier`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
	const customerId = invoice.customer as string;

	// You could send email notification here
	console.error(`Payment failed for customer ${customerId}, invoice ${invoice.id}`);
}

function getTierFromPriceId(priceId: string): string {
	const proMonthly = import.meta.env.STRIPE_PRICE_PRO_MONTHLY;
	const proYearly = import.meta.env.STRIPE_PRICE_PRO_YEARLY;
	const businessMonthly = import.meta.env.STRIPE_PRICE_BUSINESS_MONTHLY;
	const businessYearly = import.meta.env.STRIPE_PRICE_BUSINESS_YEARLY;
	const enterpriseMonthly = import.meta.env.STRIPE_PRICE_ENTERPRISE_MONTHLY;
	const enterpriseYearly = import.meta.env.STRIPE_PRICE_ENTERPRISE_YEARLY;

	if (priceId === proMonthly || priceId === proYearly) {
		return 'pro';
	} else if (priceId === businessMonthly || priceId === businessYearly) {
		return 'business';
	} else if (priceId === enterpriseMonthly || priceId === enterpriseYearly) {
		return 'enterprise';
	}

	return 'free';
}
