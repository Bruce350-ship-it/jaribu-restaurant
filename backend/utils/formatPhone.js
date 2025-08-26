function formatPhone(phone) {
  if (!phone) return null;

  // Remove spaces, hyphens, and parentheses
  phone = phone.replace(/[\s-()]/g, '');

  // If starts with 0, replace with +256
  if (phone.startsWith('0') && phone.length === 10) {
    return phone.replace(/^0/, '+256');
  }

  // If already in international format
  if (phone.startsWith('+') && phone.length === 13) {
    return phone;
  }

  // Fallback: return null or throw
  return null;
}

module.exports = formatPhone;