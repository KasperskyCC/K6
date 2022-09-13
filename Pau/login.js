import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 100 }, // simulate ramp-up of traffic from 1 to 100
        // { duration: '1ms', target: 100 }, // stay at 100 users for 1 minutes
        // { duration: '1ms', target: 0 }, // ramp-down to 0 users
    ]
};

const BASE_URL = 'http://localhost:4173/';

export default function() {
    const loginPage = http.get(BASE_URL);
    check(loginPage, {
        'is status 200': (r) => r.status === 200,
        'body size is 11,105 bytes': (r) => r.body.length == 11105,
    });
    sleep(1);
}