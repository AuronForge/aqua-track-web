export function buildInitials(name?: string | null): string {
  if (!name?.trim()) return 'U';

  const words = name.trim().split(/\s+/);

  if (words.length === 1) return words[0].charAt(0).toUpperCase();

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}
