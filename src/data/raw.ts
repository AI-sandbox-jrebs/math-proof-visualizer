/**
 * Tag for authoring LaTeX inside template literals without escaping every
 * backslash. `r` is `String.raw`, so `r`\frac{1}{2}`` survives intact.
 */
export const r = String.raw;
