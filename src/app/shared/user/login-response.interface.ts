export interface LoginResponse {
  registerInfo: {
    idUser: number;
    userId: number;
    userUUID: string;
  };
  resetToken: string;
  token: string;
}
