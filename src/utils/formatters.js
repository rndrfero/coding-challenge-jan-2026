export function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPrice(priceInCents) {
  return ((priceInCents ?? 0) / 100).toFixed(2);
}
