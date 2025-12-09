import { TAuthUser } from '@repo/common';

/**
 * Checks if a user has premium access (has active subscription or legacy isPremium flag)
 * @param user - The authenticated user or null
 * @returns true if user is premium, false otherwise
 */
export function isPremiumUser(user: TAuthUser | null): boolean {
    if (!user) return false;
    // Check subscription first (new system), then fall back to isPremium (legacy)
    return !!user.activeSubscription || (user.isPremium ?? false);
}

/**
 * Determines the access level a user has to premium content
 * @param user - The authenticated user or null
 * @param contentIsPremium - Whether the content is marked as premium
 * @returns 'full' if user has full access, 'preview' if user can see preview, 'none' if no access
 */
export function getContentAccessLevel(
    user: TAuthUser | null,
    contentIsPremium: boolean,
): 'full' | 'preview' | 'none' {
    // If content is not premium, everyone has full access
    if (!contentIsPremium) {
        return 'full';
    }

    // If user is not authenticated, they can see preview
    if (!user) {
        return 'preview';
    }

    // Check subscription first (new system), then fall back to isPremium (legacy)
    const hasAccess = !!user.activeSubscription || (user.isPremium ?? false);

    if (hasAccess) {
        return 'full';
    }

    // Authenticated but not premium users can see preview
    return 'preview';
}


