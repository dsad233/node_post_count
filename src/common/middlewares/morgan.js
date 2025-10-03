import morgan from 'morgan';

export default morgan(function (tokens, req, res) {
  tokens.time = () => {
    return new Date().toLocaleString();
  };
  return [
    tokens.time(),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res),
    'ms',
  ].join(' ');
});
