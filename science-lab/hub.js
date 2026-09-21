// Native disclosures work without JavaScript. Links from class pages select their year.
const yearGroups = [...document.querySelectorAll('.year-lab')];
for (const group of yearGroups) group.addEventListener('toggle', () => {
  if (group.open) for (const other of yearGroups) if (other !== group) other.open = false;
});
function openLinkedSection() {
  const year = new URLSearchParams(location.search).get('year');
  if (year === '7' || year === '8') document.getElementById(`year-${year}`).open = true;
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = id ? document.getElementById(id) : null;
  if (target) {
    const ancestors = []; let parent = target;
    while (parent) { if (parent.tagName === 'DETAILS') ancestors.unshift(parent); parent = parent.parentElement; }
    for (const ancestor of ancestors) ancestor.open = true;
  }
}
openLinkedSection();
window.addEventListener('hashchange', openLinkedSection);
