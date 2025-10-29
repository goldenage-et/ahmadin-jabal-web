export class EmailVerificationEvent {
  constructor(
    public payload: {
      otp: string;
      email: string;
      firstName: string;
      middleName: string;
    },
  ) {}
}
