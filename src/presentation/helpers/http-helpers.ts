import { HttpResponse } from '../protocols/http';

export function badRequest(error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error
  };
}

export function serverError(error: Error): HttpResponse {
  return {
    statusCode: 500,
    body: error
  };
}

export function created(data: any): HttpResponse {
  return {
    statusCode: 201,
    body: data
  };
}

export function unprocessableEntity(error: Error): HttpResponse {
  return {
    statusCode: 422,
    body: error
  };
}

export function notFound(error: Error): HttpResponse {
  return {
    statusCode: 404,
    body: error
  };
}

export function ok(data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  };
}
