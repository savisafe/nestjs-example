import * as process from 'process';
export const setHead = (response) => {
  response.setHeader('Access-Control-Allow-Origin', process.env.CORS_DOMEN);
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,OPTIONS',
  );
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );
};
