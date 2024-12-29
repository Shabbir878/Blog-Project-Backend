export type TErrorSource = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  errorDetails: TErrorSource;
  success: boolean;
  statusCode: number;
  message: string;
  error: {
    details: TErrorSource;
  };
  stack?: string;
};
