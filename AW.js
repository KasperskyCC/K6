import http from 'k6/http';
import { check, group, sleep } from 'k6';
export const options = {
    stages: [
      { duration: '30s', target: 100 },
      { duration: '40s', target: 100 },
      { duration: '20s', target: 0 },
    ],
};
export default function() {
    const url = 'http://0.0.0.0:8080/auth/login';
    const login = JSON.stringify({
        username: "admin",
        password: "password"
    });
    const params = {
        header: {'Content-Type': 'application/json',},
    };
    const res = http.post(url, login, params);
    check(res,{'Logowanie': (res) => res.status = 200,})
} 