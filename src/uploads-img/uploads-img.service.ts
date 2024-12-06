import { Injectable } from '@nestjs/common';
import { setHead, setToken } from '../functions';

@Injectable()
export class UploadsImgService {
  async postImg(file, response, request) {
    setHead(response);
    const token = setToken(request);
    try {
      console.log('успех', token);
    } catch (error) {
      console.error(error);
    }
  }
}
