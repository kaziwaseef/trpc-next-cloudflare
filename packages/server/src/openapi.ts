import { appRouter } from './trpc/router';
import { generateOpenApiDocument } from 'trpc-to-openapi';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'tRPC OpenAPI',
  version: '1.0.0',
  baseUrl: 'http://localhost:1337/api/',
});
