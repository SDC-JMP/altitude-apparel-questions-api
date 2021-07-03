import http from 'k6/http';
import { sleep, check } from 'k6';

//Test get request for questions
export const options = {
  stages: [{ duration: '10s', target: 500 }],
};

// export default function() {
//   for (let product_id = 100000; product_id >= 100000 -1000; product_id -= 1) {
//     let res = http.get('http://localhost:5000/qa/questions/:product_id');
//   check(res, {
//     'Check status:': (r) => r.status === 200,
//     'Response time:': (r) => r.timing.duration < 2000,
//   });
//   sleep(1);
//   }
// }

export default function() {
  for (let productId = 6879306; productId >= 6879306 - 1000; productId -= 1) {
    const res = http.get(`http://localhost:5000/qa/answers/${productId}`);
    check(res, {
      'Check status:': (r) => r.status === 200,
      'Response time:': (r) => r.timings.duration < 2000,
    });
    sleep(1);
  }
}
