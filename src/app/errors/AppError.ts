class AppError extends Error {
  public statusCode: number;
  public errorDetails: any;
  public stack?: string;

  constructor(
    statusCode: number,
    message: string,
    errorDetails: any = [],
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Method to get the formatted error response
  public getFormattedErrorResponse() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      error: {
        details: this.errorDetails,
      },
      stack: this.stack || '',
    };
  }
}

export default AppError;
