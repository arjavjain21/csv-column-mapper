/**
 * Enhanced error handling utilities
 */

export interface ErrorContext {
	userId?: string;
	userEmail?: string;
	action?: string;
	metadata?: Record<string, unknown>;
}

export interface UserFriendlyError {
	message: string;
	title: string;
	suggestions: string[];
	retryable: boolean;
}

/**
 * Convert technical errors to user-friendly messages
 */
export function getUserFriendlyError(error: unknown, context?: ErrorContext): UserFriendlyError {
	const errorMessage = error instanceof Error ? error.message : String(error);

	// File upload errors
	if (errorMessage.includes('file') || errorMessage.includes('upload')) {
		return {
			title: 'File Upload Error',
			message: 'There was a problem uploading your file.',
			suggestions: [
				'Check that the file is a valid CSV file',
				'Ensure the file is not too large (max 50MB)',
				'Try uploading the file again',
				'Check your internet connection'
			],
			retryable: true
		};
	}

	// CSV parsing errors
	if (errorMessage.includes('parse') || errorMessage.includes('CSV') || errorMessage.includes('PapaParse')) {
		return {
			title: 'CSV Parsing Error',
			message: 'We couldn\'t read your CSV file.',
			suggestions: [
				'Ensure the file is properly formatted as CSV',
				'Check for special characters or encoding issues',
				'Try opening the file in Excel and saving as CSV again',
				'Verify the file has headers in the first row'
			],
			retryable: true
		};
	}

	// Network errors
	if (
		errorMessage.includes('network') ||
		errorMessage.includes('fetch') ||
		errorMessage.includes('connection') ||
		errorMessage.includes('timeout')
	) {
		return {
			title: 'Connection Error',
			message: 'We couldn\'t connect to our servers.',
			suggestions: [
				'Check your internet connection',
				'Try again in a few moments',
				'Disable VPN if enabled',
				'Check firewall settings'
			],
			retryable: true
		};
	}

	// Authentication errors
	if (
		errorMessage.includes('auth') ||
		errorMessage.includes('unauthorized') ||
		errorMessage.includes('session') ||
		errorMessage.includes('token')
	) {
		return {
			title: 'Authentication Error',
			message: 'Your session has expired or you need to sign in.',
			suggestions: [
				'Please sign in again',
				'Check that your account is verified',
				'Clear your browser cache and cookies',
				'Contact support if the problem persists'
			],
			retryable: false
		};
	}

	// Validation errors
	if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
		return {
			title: 'Validation Error',
			message: 'Some data doesn\'t meet the requirements.',
			suggestions: [
				'Check the validation rules for your columns',
				'Review the error messages in the preview',
				'Fix the data in your source file',
				'Adjust validation rules if needed'
			],
			retryable: true
		};
	}

	// Storage/quota errors
	if (errorMessage.includes('quota') || errorMessage.includes('storage') || errorMessage.includes('limit')) {
		return {
			title: 'Storage Limit Reached',
			message: 'You\'ve reached your storage limit.',
			suggestions: [
				'Upgrade to a higher tier for more storage',
				'Delete old mappings to free up space',
				'Export and remove unused mappings',
				'Contact support for assistance'
			],
			retryable: false
		};
	}

	// Generic error
	return {
		title: 'Something Went Wrong',
		message: 'An unexpected error occurred.',
		suggestions: [
			'Try refreshing the page',
			'Check that all required fields are filled',
			'Try again in a few moments',
			'Contact support if the problem persists'
		],
		retryable: true
	};
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: ErrorContext): void {
	const errorDetails = {
		message: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : undefined,
		timestamp: new Date().toISOString(),
		...context
	};

	console.error('Error occurred:', errorDetails);

	// In production, send to error tracking service (e.g., Sentry)
	if (import.meta.env.PROD) {
		// TODO: Integrate with Sentry or similar service
		// Sentry.captureException(error, { extra: errorDetails });
	}
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	options: {
		maxRetries?: number;
		initialDelay?: number;
		maxDelay?: number;
		onRetry?: (attempt: number, error: unknown) => void;
	} = {}
): Promise<T> {
	const {
		maxRetries = 3,
		initialDelay = 1000,
		maxDelay = 10000,
		onRetry
	} = options;

	let lastError: unknown;
	let delay = initialDelay;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;

			if (attempt < maxRetries) {
				if (onRetry) {
					onRetry(attempt + 1, error);
				}

				await new Promise((resolve) => setTimeout(resolve, delay));
				delay = Math.min(delay * 2, maxDelay);
			}
		}
	}

	throw lastError;
}

/**
 * Create a user-friendly error message component
 */
export function formatErrorForDisplay(error: UserFriendlyError): string {
	let message = `${error.title}\n\n${error.message}\n\n`;
	
	if (error.suggestions.length > 0) {
		message += 'Suggestions:\n';
		error.suggestions.forEach((suggestion, index) => {
			message += `${index + 1}. ${suggestion}\n`;
		});
	}

	return message;
}
