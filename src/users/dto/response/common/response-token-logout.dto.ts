import { ApiResponseProperty } from "@nestjs/swagger";

export class ResponseTokenLogOut {
  @ApiResponseProperty({ example: null })
  accessToken: string;

  @ApiResponseProperty({ example: null })
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}