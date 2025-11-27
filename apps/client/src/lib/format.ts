import { CURRENT_CURRENCY, ECurrency } from "@repo/common";

export function formatPrice(price: number, currency: ECurrency = CURRENT_CURRENCY) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
}