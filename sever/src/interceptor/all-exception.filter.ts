import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server';

    if (status === HttpStatus.UNAUTHORIZED) {
      response.setHeader(
        'Set-Cookie',
        `refresh-token=; HttpOnly; Path=/; Max-Age=0;SameSite=None; Secure`,
      );
    }

    response.status(status).json({
      status,
      timestamp: new Date().toUTCString(),
      message,
      path: request.route.path,
    });
    return;
  }
}
