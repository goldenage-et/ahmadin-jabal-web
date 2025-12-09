import { TAuthUser } from '@repo/common';

export type ContentAccessLevel = 'full' | 'preview' | 'none';

/**
 * Determines the access level a user has to premium content
 * @param user - The authenticated user or null if unauthenticated
 * @param contentIsPremium - Whether the content is marked as premium
 * @param hasActiveSubscription - Optional: whether user has an active subscription (checked from database)
 * @returns 'full' if user has full access, 'preview' if user can see preview, 'none' if no access
 */
export function getContentAccessLevel(
    user: TAuthUser | null,
    contentIsPremium: boolean,
    hasActiveSubscription?: boolean,
): ContentAccessLevel {
    // If content is not premium, everyone has full access
    if (!contentIsPremium) {
        return 'full';
    }

    // If user is not authenticated, they can see preview
    if (!user) {
        return 'preview';
    }

    // Check subscription first (new system), then fall back to isPremium (legacy)
    const hasAccess = hasActiveSubscription ?? user.isPremium ?? false;

    if (hasAccess) {
        return 'full';
    }

    // Authenticated but not premium users can see preview
    return 'preview';
}

/**
 * Checks if a user is premium (has active subscription or legacy isPremium flag)
 * @param user - The authenticated user or null
 * @param hasActiveSubscription - Optional: whether user has an active subscription (checked from database)
 * @returns true if user is premium, false otherwise
 */
export function isPremiumUser(
    user: TAuthUser | null,
    hasActiveSubscription?: boolean,
): boolean {
    if (!user) return false;
    // Check subscription first (new system), then fall back to isPremium (legacy)
    return hasActiveSubscription ?? user.isPremium ?? false;
}


