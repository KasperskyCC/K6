import http from 'k6/http';

export default function() {
    const url = 'http://localhost:4173/';
    const payload = JSON.stringify({
        username: "user_two",
        password: "password"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    http.post(url, payload,params);
}