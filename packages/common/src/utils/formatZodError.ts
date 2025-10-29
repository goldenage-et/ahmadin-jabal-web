import type { ZodError, ZodIssue } from 'zod';

const formatZodIssue = (issue: ZodIssue): Record<string, any> => {
  const { path: paths, message } = issue;

  const result: Record<string, any> = {};
  let currentLevel = result;
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    // Only allow string or number as keys
    if (typeof path !== 'string' && typeof path !== 'number') {
      continue;
    }
    if (i === paths.length - 1) {
      currentLevel[path] = message;
    } else {
      if (!(path in currentLevel)) {
        currentLevel[path] = {};
      }
      currentLevel = currentLevel[path];
    }
  }

  return result;
};

export function formatZodError<T = any>(error: ZodError<T>) {
  const { issues } = error;
  let formattedIssues: Record<string, any> = {};

  if (issues?.length) {
    for (const issue of issues) {
      if (issue) {
        // Deep merge the formatted issue into formattedIssues
        const merge = (target: any, source: any) => {
          for (const key in source) {
            if (
              Object.prototype.hasOwnProperty.call(source, key) &&
              typeof source[key] === 'object' &&
              source[key] !== null &&
              typeof target[key] === 'object' &&
              target[key] !== null
            ) {
              merge(target[key], source[key]);
            } else {
              target[key] = source[key];
            }
          }
        };
        merge(formattedIssues, formatZodIssue(issue));
      }
    }
    return formattedIssues;
  }
  return issues;
}
