import { z } from 'zod';

/**
 * Converts a Zod schema to a basic Swagger schema object
 * This is a simplified version that handles common Zod types
 * @param schema - The Zod schema to convert
 * @returns Basic Swagger schema object
 */
export function zodToSwaggerSchema(schema: z.ZodTypeAny) {
  // This is a simplified conversion - in a real app you might want a more comprehensive library
  if (schema instanceof z.ZodString) {
    return { type: 'string' };
  }
  if (schema instanceof z.ZodNumber) {
    return { type: 'number' };
  }
  if (schema instanceof z.ZodBoolean) {
    return { type: 'boolean' };
  }
  if (schema instanceof z.ZodArray) {
    return {
      type: 'array',
      items: zodToSwaggerSchema(schema.element as z.ZodTypeAny),
    };
  }
  if (schema instanceof z.ZodObject) {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    Object.entries(schema.shape).forEach(([key, value]) => {
      properties[key] = zodToSwaggerSchema(value as z.ZodTypeAny);
      if (!(value instanceof z.ZodOptional)) {
        required.push(key);
      }
    });

    return {
      type: 'object',
      properties,
      ...(required.length > 0 && { required }),
    };
  }
  if (schema instanceof z.ZodOptional) {
    return zodToSwaggerSchema(schema.unwrap() as z.ZodTypeAny);
  }

  // Default fallback
  return { type: 'string' };
}

/**
 * Creates a Swagger schema object from a Zod schema
 * @param schema - The Zod schema to convert
 * @returns Swagger schema object
 */
export function createSwaggerSchema(schema: z.ZodTypeAny) {
  return zodToSwaggerSchema(schema);
}

/**
 * Helper function to create API property decorator from Zod schema
 * @param schema - The Zod schema
 * @returns Object with schema property
 */
export function ApiProperty(schema: z.ZodTypeAny) {
  return {
    schema: zodToSwaggerSchema(schema),
  };
}

/**
 * Creates a proper format for @ApiBody decorator
 * @param schema - The Zod schema to convert
 * @returns Object with schema property for @ApiBody
 */
export function createApiBodySchema(schema: z.ZodTypeAny) {
  return {
    schema: zodToSwaggerSchema(schema),
  };
}
