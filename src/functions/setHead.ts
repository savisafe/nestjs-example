import * as process from 'process';
export const setHead = (response) => {
  response.setHeader('Access-Control-Allow-Origin', process.env.CORS_DOMEN);
  response.setHeader('Access-Control-Allow-Credentials', 'true');
};
