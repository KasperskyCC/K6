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
        exec: "getBooks",
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
    const authParams = {
        headers: { 
            'Content-Type': 'application/json',
            'authorization': 'Bearer ${token}'
        }
    }

    const url = 'http://0.0.0.0:8080/auth/login';
    const payload = JSON.stringify({
        login: "admin",
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
        'body include login': (r) => r.body.length > 0
    })

    sleep(1)
}

export function getBooks() {
    const res = http.get('http://0.0.0.0:8080/books')
    check(res, {
        'status code is 200': (r) => r.status == 200,
        'body is includes': (r) => r.body.length > 0
    })
    sleep(1)
}