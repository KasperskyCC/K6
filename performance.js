import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
      authorization: {
        executor: 'ramping-vus',
        exec: "startAuthorization",
        startVUs: 0,
        stages: [
          { duration: '1s', target: 25 },
          { duration: '10s', target: 0 }
        ]
      },

      users: {
        executor: 'per-vu-iterations',
        exec: "getUsers",
        vus: 40,
        iterations: 2,
        startTime: '5s'
      }
    },

    thresholds: {
        http_req_duration: ['p(95) < 250', 'p(90) < 100'],
        http_req_failed: ['rate<=0.05']
    }
}

export function startAuthorization() {
    const url = 'https://httpbin.org/post';
    const payload = JSON.stringify({
        login: "test",
        password: "password"
    })

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const res = http.post(url, payload, params);

    check(res, {
        'status code is 200': (r) => r.status == 200,
        'body include login': (r) => r.body.includes("test")
    })

    sleep(1)
}

export function getUsers() {
    const res = http.get('https://jsonplaceholder.typicode.com/users')
    check(res, {
        'status code is 200': (r) => r.status == 200,
        'body is includes': (r) => r.body.length > 0
    })
    sleep(1)
}
