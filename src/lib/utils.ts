export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return 'الآن';
  } else if (diffMin < 60) {
    return `منذ ${diffMin} دقيقة`;
  } else if (diffHour < 24) {
    return `منذ ${diffHour} ساعة`;
  } else if (diffDay < 7) {
    return `منذ ${diffDay} يوم`;
  } else if (diffWeek < 4) {
    return `منذ ${diffWeek} أسبوع`;
  } else if (diffMonth < 12) {
    return `منذ ${diffMonth} شهر`;
  } else {
    return `منذ ${diffYear} سنة`;
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number, listingType?: string): string {
  const formatted = price.toLocaleString('ar-SA');
  if (listingType === 'rent') {
    return `${formatted} ريال/شهرياً`;
  }
  return `${formatted} ريال`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}