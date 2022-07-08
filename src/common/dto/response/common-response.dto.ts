export class CommonResponseDto {
  statusCode: number;
  message: string;
  data: object;

  constructor(statusCode: number, data: object) {
    this.statusCode = statusCode;
    this.message = 'success';
    this.data = data;
  }
}