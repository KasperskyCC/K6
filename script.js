// import http from 'k6/http';
// import { sleep } from 'k6';

// export default function() {
//     http.get('http://localhost:4173/auth/login');
//     sleep(1);
// }

import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '15s', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '15s', target: 0 },
  ],
};

export default function() {
  let res = http.get('https://localhost.0.0.1/');
  check(res, { 'status was 200': r => r.status == 200 });
  sleep(1);
}