/**
 * 表单校验失败后，平滑滚动到第一个标红（aria-invalid）字段并聚焦。
 * 在 setErrors 之后调用；等待一帧让 React 先把 aria-invalid 渲染到 DOM。
 */
export const scrollToFirstError = (root: HTMLElement | null): void => {
  requestAnimationFrame(() => {
    const el = root?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  });
};
