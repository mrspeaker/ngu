export function $(sel, el) {
    return (el || document).querySelector(sel);
}
export function $click(sel, f, el) {
    const dom = (el || document).querySelector(sel, el);
    if (dom) {
        dom.addEventListener("click", f);
    }
}
