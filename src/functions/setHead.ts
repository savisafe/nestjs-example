import * as process from 'process';
export const setHead = (response) => {
  response.setHeader(
    'Access-Control-Allow-Origin',
    process.env.CORS_DOMEN_LOCAL,
  );
  response.setHeader(
    'Access-Control-Allow-Origin',
    process.env.CORS_DOMEN_PROD,
  );
  response.setHeader('Access-Control-Allow-Credentials', 'true');
};
