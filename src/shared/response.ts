// API 응답 형식 규격화

type TApiFailResponse = {
  success: false;
  err: {
    code?: string;
    msg: string;
  };
};

type TApiSuccessResponse<T> = {
  success: true;
  data: T;
};

type TApiResponse<T = any> = TApiFailResponse | TApiSuccessResponse<T>;

export const sendSuccessRes = <T>(data: T): TApiResponse<T> => ({
  success: true,
  data,
});

export const sendFailRes = (msg: string, code?: string): TApiResponse => ({
  success: false,
  err: {
    code,
    msg,
  },
});
