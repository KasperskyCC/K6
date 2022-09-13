import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    authorization: {
        executor: 'ramping-vus',
        exec: 'startAuthorization',
        startVUs: 0,
        stages: [
            {duration: '1s', target: 25},
            {duration: '10s', target: 0}
        ]
    },

    autrorizationFail: {
        executor: 'ramping-vus',
        exec: 'startAuthorizationFail',
        startVUs: 0,
        stages: [
            {duration: '1s', target: 25},
            {duration: '10s', target: 0}
        ]
    },

    books: {
        executor: 'per-vu-iterations',
        exec: 'getBooks',
        vus: 1,
        iterations: 2,
        startTime: '3s'
    }
  },

  thresholds: {
    http_req_duration: ['p(95) < 250'],
    http_req_failed: [`rate<=0.05`]
  }
}

export function startAuthorization() {
    const url = 'http://0.0.0.0:8080/auth/login';
    const payload = JSON.stringify({
        username: 'admin',
        password: 'password'
    })

    const params = {
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    }

    const res = http.post(url,payload,params);

    check(res, {
        'status code is 200': (r) => r.status == 200,
        'body is includes': (r) => r.body.length > 0
    })
    sleep(1)
}

export function startAuthorizationFail() {
    const url = 'http://0.0.0.0:8080/auth/login';
    const payload = JSON.stringify({
        username: 'admin',
        password: 'invalidpassword'
    })

    const params = {
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    }

    const res = http.post(url,payload,params);

    check(res, {
        'status code is 401': (r) => r.status == 401,
        'body is includes': (r) => r.body.length > 0
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