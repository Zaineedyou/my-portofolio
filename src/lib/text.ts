/** Short letter-mark for a label, e.g. "C++" -> "C+", "Node.js" -> "No". */
export function monogram(name: string) {
  const clean = name.replace(/\./g, "");
  return clean.slice(0, 2);
}
