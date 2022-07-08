import { ApiResponseProperty } from "@nestjs/swagger";

export class ResponseToken {
  @ApiResponseProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImFnZW50IjoiQ2hyb21lTWFjMTAuMTVkZXNriwiaWF0IjoxNjU3MjYyNDYwLCJleHAiNTcyNjYwNjB9.kehVM8kCRDxJc6alYugimxnUHvNbNIAEpal2vVAU' })
  accessToken: string;

  @ApiResponseProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImFnZW50Q2hyb21lTWFjMTAuMTVkZXNrdG9wIiwiaWF0IjoxNjU3MjYyNDYwLCJleHE2NTg0NzIwNjB9.Sspr6qMp_M4qibLQaf9L_sKEI1T77o1WE_uQYIfE' })
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
