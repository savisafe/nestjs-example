export const setHead = (response) => {
  response.setHeader('Access-Control-Allow-Origin', `http://localhost:3000`);
  response.setHeader('Access-Control-Allow-Origin', `https://whox.is`);
  response.setHeader('Access-Control-Allow-Credentials', 'true');
};
