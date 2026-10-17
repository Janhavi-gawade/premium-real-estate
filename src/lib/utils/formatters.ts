/**
 * Formats a numeric Indian Rupee value into human-friendly format (e.g. ₹95 Lakh, ₹2.40 Cr, ₹45,000/mo)
 */
export function formatIndianPrice(amount: number, transactionType: 'buy' | 'rent' = 'buy'): string {
  if (!amount || isNaN(amount)) return "Price on Request";

  if (transactionType === 'rent') {
    return `₹${amount.toLocaleString('en-IN')} / month`;
  }

  if (amount >= 10000000) {
    const inCr = amount / 10000000;
    // e.g. 1.85 Cr or 2 Cr
    return `₹${inCr % 1 === 0 ? inCr.toFixed(0) : inCr.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    const inLakh = amount / 100000;
    return `₹${inLakh % 1 === 0 ? inLakh.toFixed(0) : inLakh.toFixed(2)} Lakh`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

/**
 * Formats area with sq.ft. unit label
 */
export function formatArea(area: number): string {
  if (!area || isNaN(area)) return "N/A";
  return `${area.toLocaleString('en-IN')} sq.ft.`;
}

/**
 * Generates an SEO-friendly URL slug from a title and location
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Formats a phone number for direct tel: links
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}
