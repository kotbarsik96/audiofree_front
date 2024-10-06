export function getCoords(el: Element) {
  const box = el.getBoundingClientRect()

  return {
    top: box.top + window.scrollY,
    left: box.left + window.scrollX,
    bottom: box.bottom + window.scrollY,
    right: box.right + window.scrollX,
  }
}
