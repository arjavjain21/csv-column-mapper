import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const { session, user, profile } = await locals.safeGetSession();

		if (!session || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		return json({
			profile
		});
	} catch (error) {
		console.error('Get profile error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
	try {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { full_name, avatar_url } = body;

		// Update user profile
		const updateData: any = {
			updated_at: new Date().toISOString()
		};

		if (full_name !== undefined) updateData.full_name = full_name;
		if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

		const { data: profile, error } = await locals.supabase
			.from('user_profiles')
			.update(updateData)
			.eq('id', user.id)
			.select()
			.single();

		if (error) {
			console.error('Update profile error:', error);
			return json({ error: 'Failed to update profile' }, { status: 500 });
		}

		return json({
			success: true,
			profile
		});
	} catch (error) {
		console.error('Update profile endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ locals }) => {
	try {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Delete user (cascade will delete profile and mappings)
		const { error } = await locals.supabase.auth.admin.deleteUser(user.id);

		if (error) {
			console.error('Delete user error:', error);
			return json({ error: 'Failed to delete account' }, { status: 500 });
		}

		return json({
			success: true,
			message: 'Account deleted successfully'
		});
	} catch (error) {
		console.error('Delete account endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
