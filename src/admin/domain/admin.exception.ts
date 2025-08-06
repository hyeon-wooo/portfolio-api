export class EmailAlreadyExistsException extends Error {
  code = 'EMAIL_ALREADY_EXISTS';
  constructor(email: string) {
    super(`이미 존재하는 이메일입니다. ${email}`);
  }
}
