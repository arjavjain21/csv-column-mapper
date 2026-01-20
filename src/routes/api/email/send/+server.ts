import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Resend } from 'resend';
import { RESEND_API_KEY, EMAIL_FROM } from '$env/static/private';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const POST: RequestHandler = async ({ request }) => {
	if (!resend) {
		return json({ error: 'Email service not configured' }, { status: 503 });
	}

	try {
		const { to, subject, html, from } = await request.json();

		if (!to || !subject || !html) {
			return json({ error: 'Missing required fields: to, subject, html' }, { status: 400 });
		}

		const result = await resend.emails.send({
			from: from || EMAIL_FROM || 'CSV Column Mapper <noreply@csvmapper.com>',
			to,
			subject,
			html
		});

		if (result.error) {
			return json({ error: result.error.message || 'Failed to send email' }, { status: 500 });
		}

		return json({ success: true, id: result.data?.id });
	} catch (error) {
		console.error('Email send error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
};
