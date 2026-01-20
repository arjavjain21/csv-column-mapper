/**
 * Email service for sending transactional emails via Resend
 */

export interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	from?: string;
}

/**
 * Send an email via the API endpoint
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
	try {
		const response = await fetch('/api/email/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(options)
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || 'Failed to send email' };
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
	email: string,
	name: string
): Promise<{ success: boolean; error?: string }> {
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Welcome to CSV Column Mapper</title>
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
				<h1 style="color: white; margin: 0;">Welcome to CSV Column Mapper!</h1>
			</div>
			<div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
				<p>Hi ${name},</p>
				<p>Thank you for signing up for CSV Column Mapper! We're excited to help you transform your CSV files with ease.</p>
				<h2 style="color: #667eea; margin-top: 30px;">Getting Started</h2>
				<ol style="padding-left: 20px;">
					<li>Upload your schema file (target structure)</li>
					<li>Upload your data file (source data)</li>
					<li>Map columns using our intuitive drag-and-drop interface</li>
					<li>Apply transformations and validation rules</li>
					<li>Export your transformed CSV</li>
				</ol>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${process.env.PUBLIC_APP_URL || 'https://csvmapper.com'}/app" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Start Mapping</a>
				</div>
				<h2 style="color: #667eea; margin-top: 30px;">Features</h2>
				<ul style="padding-left: 20px;">
					<li>✨ Visual drag-and-drop column mapping</li>
					<li>🔄 Column transformations (split, concatenate, format)</li>
					<li>✅ Data validation rules</li>
					<li>📊 Live preview of output</li>
					<li>☁️ Cloud sync (Pro+ tiers)</li>
					<li>📚 Template library</li>
				</ul>
				<p style="margin-top: 30px;">If you have any questions, feel free to reach out to our support team.</p>
				<p>Happy mapping!<br>The CSV Column Mapper Team</p>
			</div>
			<div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
				<p>This email was sent to ${email}</p>
				<p><a href="${process.env.PUBLIC_APP_URL || 'https://csvmapper.com'}/unsubscribe" style="color: #667eea;">Unsubscribe</a></p>
			</div>
		</body>
		</html>
	`;

	return sendEmail({
		to: email,
		subject: 'Welcome to CSV Column Mapper!',
		html
	});
}

/**
 * Send processing complete email
 */
export async function sendProcessingCompleteEmail(
	email: string,
	name: string,
	filename: string,
	rowCount: number
): Promise<{ success: boolean; error?: string }> {
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Processing Complete</title>
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
				<h1 style="color: white; margin: 0;">✅ Processing Complete!</h1>
			</div>
			<div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
				<p>Hi ${name},</p>
				<p>Your CSV file has been successfully processed!</p>
				<div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
					<p style="margin: 0;"><strong>File:</strong> ${filename}</p>
					<p style="margin: 10px 0 0 0;"><strong>Rows Processed:</strong> ${rowCount.toLocaleString()}</p>
				</div>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${process.env.PUBLIC_APP_URL || 'https://csvmapper.com'}/app" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">View Results</a>
				</div>
				<p>Thank you for using CSV Column Mapper!</p>
			</div>
		</body>
		</html>
	`;

	return sendEmail({
		to: email,
		subject: `Processing Complete: ${filename}`,
		html
	});
}

/**
 * Send error notification email
 */
export async function sendErrorEmail(
	email: string,
	name: string,
	errorMessage: string,
	filename?: string
): Promise<{ success: boolean; error?: string }> {
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Processing Error</title>
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
				<h1 style="color: white; margin: 0;">⚠️ Processing Error</h1>
			</div>
			<div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
				<p>Hi ${name},</p>
				<p>We encountered an error while processing your CSV file.</p>
				<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
					<p style="margin: 0; color: #dc2626;"><strong>Error:</strong></p>
					<p style="margin: 10px 0 0 0;">${errorMessage}</p>
					${filename ? `<p style="margin: 10px 0 0 0;"><strong>File:</strong> ${filename}</p>` : ''}
				</div>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${process.env.PUBLIC_APP_URL || 'https://csvmapper.com'}/app" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Try Again</a>
				</div>
				<p>If this error persists, please contact our support team for assistance.</p>
			</div>
		</body>
		</html>
	`;

	return sendEmail({
		to: email,
		subject: `Processing Error${filename ? `: ${filename}` : ''}`,
		html
	});
}
