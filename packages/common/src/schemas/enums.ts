
// ========================================
// Invitation Related Enums
// ========================================
export enum EInvitationStatus {
    pending = 'pending',
    accepted = 'accepted',
    rejected = 'rejected',
    expired = 'expired',
    cancelled = 'cancelled',
}

// ========================================
// User & Authentication Related Enums
// ========================================
export enum EIdentityProvider {
    email = 'email',
    google = 'google',
}

export enum OAuthProvider {
    google = 'google',
}

// ========================================
// Order Related Enums
// ========================================
export enum EOrderStatus {
    pending = 'pending',
    confirmed = 'confirmed',
    processing = 'processing',
    shipped = 'shipped',
    delivered = 'delivered',
    cancelled = 'cancelled',
    refunded = 'refunded',
}

export enum EPaymentStatus {
    pending = 'pending',
    paid = 'paid',
    failed = 'failed',
    refunded = 'refunded',
}

export enum EPaymentMethod {
    onDelivery = 'onDelivery',
    bankTransfer = 'bankTransfer',
}

// Payment Method Status Enum
export enum EPaymentMethodStatus {
    active = 'active',
    inactive = 'inactive',
    deprecated = 'deprecated',
}

export enum EShippingMethod {
    standard = 'standard',
    express = 'express',
    pickup = 'pickup',
}

// ========================================
// Book Related Enums
// ========================================
export enum EBookStatus {
    active = 'active',
    draft = 'draft',
    archived = 'archived',
}

export enum ESearchAnalyticsSource {
    navigation = 'navigation',
    shopPage = 'shop-page',
    suggestionClick = 'suggestion-click',
}

// ========================================
// Review Related Enums
// ========================================
export enum EReviewStatus {
    pending = 'pending',
    approved = 'approved',
    rejected = 'rejected',
    hidden = 'hidden',
}

export enum EReviewReportReason {
    spam = 'spam',
    inappropriate = 'inappropriate',
    fake = 'fake',
    harassment = 'harassment',
    other = 'other',
}

export enum EReviewReportStatus {
    pending = 'pending',
    resolved = 'resolved',
    dismissed = 'dismissed',
}

export enum EReviewType {
    book = 'book',
    store = 'store',
}

export enum EReviewHelpful {
    helpful = 'helpful',
    notHelpful = 'notHelpful',
}

// ========================================
// Transaction Related Enums
// ========================================
export enum ETransactionType {
    payment = 'payment',
    refund = 'refund',
    payout = 'payout',
}

export enum ETransactionStatus {
    pending = 'pending',
    processing = 'processing',
    completed = 'completed',
    failed = 'failed',
    cancelled = 'cancelled',
}



export enum ECurrency {
    ETB = 'ETB',
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    INR = 'INR',
    MYR = 'MYR',
    SGD = 'SGD',
    HKD = 'HKD',
    CNY = 'CNY',
    JPY = 'JPY',
}

// ========================================
// Article Related Enums
// ========================================
export enum EArticleStatus {
    draft = 'draft',
    published = 'published',
    archived = 'archived',
    scheduled = 'scheduled',
}

// ========================================
// Publication Related Enums
// ========================================
export enum EPublicationStatus {
    draft = 'draft',
    published = 'published',
    archived = 'archived',
    scheduled = 'scheduled',
}

export enum EPublicationCommentStatus {
    pending = 'pending',
    approved = 'approved',
    rejected = 'rejected',
    spam = 'spam',
    deleted = 'deleted',
}

// ========================================
// Media Related Enums
// ========================================
export enum EMediaType {
    image = 'image',
    video = 'video',
    audio = 'audio',
    document = 'document',
}

export enum EMediaSource {
    upload = 'upload',
    youtube = 'youtube',
    vimeo = 'vimeo',
    external = 'external',
}

export enum EMediaStatus {
    active = 'active',
    archived = 'archived',
    deleted = 'deleted',
}