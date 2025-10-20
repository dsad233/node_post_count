import cors from 'cors';
const whitelist = ['http://localhost:8080', 'http://localhost:8081'];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      // 만일 whitelist 배열에 origin인자가 있을 경우
      callback(null, true); // cors 허용
    } else {
      callback(new Error('Not Allowed Origin!')); // cors 비허용
    }
  },
  credentials: true,
};

export default cors(corsOptions);
