export const camelToTitle = (text: string) => {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

// Capitalize the first letter of the question type
export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Convert a string to camel case
export function toCamelCase(text: string) {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

// Convert a string to snake case
export function toSnakeCase(text: string) {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : `_${word.toLowerCase()}`;
    })
    .replace(/\s+/g, '');
}

// Convert a string to kebab case
export function toKebabCase(text: string) {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : `-${word.toLowerCase()}`;
    })
    .replace(/\s+/g, '');
}

// Convert a string to title case
export function toTitleCase(text: string) {
  return text.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
}

// Convert a string to sentence case
export function toSentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Convert a string to pascal case
export function toPascalCase(text: string) {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

// Convert a string to constant case
export function toConstantCase(text: string) {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '_');
}

// Convert a string to dot case
export function toDotCase(text: string) {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : `.${word.toLowerCase()}`;
    })
    .replace(/\s+/g, '');
}

// Convert a string to path case
export function toPathCase(text: string) {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : `/${word.toLowerCase()}`;
    })
    .replace(/\s+/g, '');
}
