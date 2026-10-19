/** Shared by MDX compilation and the table of contents. */
export function numberHeading(text, level, state) {
  const title = text.replace(/^(?:\d+(?:\.\d+)+\.?|\d+[.)])\s+/, '');
  if (level === 2) {
    state.section += 1;
    state.subsection = 0;
    return `${state.section}. ${title}`;
  }
  if (!state.section) return text;
  state.subsection += 1;
  return `${state.section}.${state.subsection} ${title}`;
}

function headingText(node) {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(headingText).join('');
}

export default function remarkNumberHeadings() {
  return (tree) => {
    const state = { section: 0, subsection: 0 };
    for (const node of tree.children) {
      if (node.type !== 'heading' || ![2, 3].includes(node.depth)) continue;
      const original = headingText(node);
      const numbered = numberHeading(original, node.depth, state);
      // Keep the original anchor so existing article links continue to work.
      const id = original.toLowerCase().replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      node.data ??= {};
      node.data.hProperties = { ...node.data.hProperties, id };
      if (numbered === original) continue;
      // Change the numeric prefix only; preserve inline links, emphasis and code.
      const prefix = numbered.slice(0, numbered.length - original.replace(/^(?:\d+(?:\.\d+)+\.?|\d+[.)])\s+/, '').length);
      const first = node.children[0];
      if (first?.type === 'text') {
        first.value = first.value.replace(/^(?:\d+(?:\.\d+)+\.?|\d+[.)])\s+/, '');
      }
      node.children.unshift({ type: 'text', value: prefix });
    }
  };
}
