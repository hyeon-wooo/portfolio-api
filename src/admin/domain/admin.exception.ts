export class EmailAlreadyExistsException extends Error {
  code = 'EMAIL_ALREADY_EXISTS';
  constructor(email: string) {
    super(`이미 존재하는 이메일입니다. ${email}`);
  }
}
export class LoginFailedException extends Error {
  code = 'LOGIN_FAILED';
  constructor(msg: string = '로그인에 실패했습니다.') {
    super(msg);
  }
}
