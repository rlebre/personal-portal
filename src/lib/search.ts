/** Lower case without accents, so "acores" finds "Açores". Apply it to both the haystack and the query. */
export function searchText(s: string) {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}
