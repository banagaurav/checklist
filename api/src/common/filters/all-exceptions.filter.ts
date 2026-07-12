import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import moment from 'moment-timezone';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    // Skip processing for 400 errors (validation errors) - let them pass through as-is
    if (status === 400) {
      if (exception instanceof HttpException) {
        const httpResponse = exception.getResponse();
        response.status(status).json(httpResponse);
      } else {
        response.status(status).json({
          statusCode: status,
          message: exception.message || 'Bad Request',
        });
      }
      return;
    }

    // Get the response from HttpException if available
    let exceptionResponse: any = {};
    let errorMessage = exception.message || 'Internal server error';

    if (exception instanceof HttpException) {
      const httpResponse = exception.getResponse();
      if (typeof httpResponse === 'string') {
        errorMessage = httpResponse;
      } else if (typeof httpResponse === 'object') {
        exceptionResponse = httpResponse;
        // Extract message from response object if available
        if (httpResponse['message']) {
          if (Array.isArray(httpResponse['message'])) {
            errorMessage = httpResponse['message'].join(', ');
          } else {
            errorMessage = httpResponse['message'];
          }
        } else if (httpResponse['error']) {
          errorMessage = httpResponse['error'];
        }
      }
    }

    // Handle ERR_JSON format if present
    const [textMsg, jsonMsg] = errorMessage.split('ERR_JSON: ');
    const finalMessage = textMsg || errorMessage;

    // Extract user-friendly messages from response errors
    let userMessage = finalMessage;
    if (exceptionResponse && exceptionResponse.errors) {
      const errorMessages: string[] = [];
      
      // Flatten all error messages from the errors object
      Object.keys(exceptionResponse.errors).forEach((field) => {
        const fieldErrors = exceptionResponse.errors[field];
        if (Array.isArray(fieldErrors)) {
          errorMessages.push(...fieldErrors);
        } else if (typeof fieldErrors === 'string') {
          errorMessages.push(fieldErrors);
        }
      });
      
      // Join all messages with a separator
      if (errorMessages.length > 0) {
        userMessage = errorMessages.join(', ');
      }
    }

    const json = {
      ...exceptionResponse,
      statusCode: status,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      path: request.url,
      message: finalMessage,
    };

    // Create an enhanced exception object for logging with all details
    const logException = {
      message: finalMessage,
      userMessage: userMessage,
      stack: exception.stack || new Error().stack,
      statusCode: status,
      response: exceptionResponse,
      originalException: exception instanceof HttpException 
        ? {
            message: exception.message,
            status: exception.getStatus(),
            response: exception.getResponse(),
          }
        : exception,
    };


    response.status(status).json(json);
  }
}
