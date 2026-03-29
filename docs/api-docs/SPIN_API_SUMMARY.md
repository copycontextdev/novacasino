# Step one check for spin availablity
curl 'https://api.novacasino.games/bonus/member-spin-award/list/?is_active=true' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc1MTQ1MzA2LCJpYXQiOjE3NzQ1NDA1MDYsImp0aSI6Ijg0YjZmMTNlYzc5YzRkMWJiNmM4NGRkZWUyNWQyZTAyIiwidXNlcl9pZCI6ImU1Y2VmNzEyLTU4NzAtNGE4NC1iZmQ0LThlMTc4MzdmNzUzYSIsIm5hbWUiOiJtaWtpYXMiLCJwaG9uZV9udW1iZXIiOiIyNTE5MjMyMTM3NjgiLCJiYWxhbmNlIjo5MC4wfQ.T4aKu1iPqeGDQzXF8hE2A2nSlVo_hhEhB5VQDm0w0JA' \
  -H 'Referer: https://novacasino.games/' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'sec-ch-ua: "Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"' \
  -H 'sec-ch-ua-mobile: ?0'

  sample response
  {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 3320,
            "condition": {
                "id": 1,
                "name": "Spin nova"
            },
            "is_active": true,
            "created_at": "2026-03-29T20:03:58.424842Z",
            "updated_at": "2026-03-29T20:03:58.424873Z"
        },
        {
            "id": 3321,
            "condition": {
                "id": 1,
                "name": "Spin nova"
            },
            "is_active": true,
            "created_at": "2026-03-29T20:04:38.908759Z",
            "updated_at": "2026-03-29T20:04:38.908784Z"
        },
        {
            "id": 3322,
            "condition": {
                "id": 1,
                "name": "Spin nova"
            },
            "is_active": true,
            "created_at": "2026-03-29T20:04:56.377738Z",
            "updated_at": "2026-03-29T20:04:56.377763Z"
        },
        {
            "id": 3323,
            "condition": {
                "id": 1,
                "name": "Spin nova"
            },
            "is_active": true,
            "created_at": "2026-03-29T20:05:16.027173Z",
            "updated_at": "2026-03-29T20:05:16.027205Z"
        }
    ]
}


# Step two on clicking spin from the spin window call this and show spin dialog based 
https://api.novacasino.games/bonus/spin-award/3325/reward/list/
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "condition": 1,
            "reward_type": "Non-Withdrawable Cash",
            "name": "10 ብር",
            "value": "10.00",
            "probability": 0,
            "text_color": "#000000",
            "background_color": "#92783f",
            "is_active": true
        },
        {
            "id": 2,
            "condition": 1,
            "reward_type": "Non-Withdrawable Cash",
            "name": "30 ብር",
            "value": "30.00",
            "probability": 0,
            "text_color": "#000000",
            "background_color": "#c02a2a",
            "is_active": true
        },
        {
            "id": 3,
            "condition": 1,
            "reward_type": "Non-Withdrawable Cash",
            "name": "100 ብር",
            "value": "100.00",
            "probability": 0,
            "text_color": "#ffffff",
            "background_color": "#0e06a6",
            "is_active": true
        },
        {
            "id": 4,
            "condition": 1,
            "reward_type": "Non-Withdrawable Cash",
            "name": "500 ብር",
            "value": "500.00",
            "probability": 0,
            "text_color": "#000000",
            "background_color": "#47ff5a",
            "is_active": true
        },
        {
            "id": 5,
            "condition": 1,
            "reward_type": "No Reward",
            "name": "Try Again",
            "value": "0.00",
            "probability": 100,
            "text_color": "#000000",
            "background_color": "#f34343",
            "is_active": true
        }
    ]
}

# On spin

curl 'https://api.novacasino.games/bonus/spin-award/3325/spin/' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc1MTQ1MzA2LCJpYXQiOjE3NzQ1NDA1MDYsImp0aSI6Ijg0YjZmMTNlYzc5YzRkMWJiNmM4NGRkZWUyNWQyZTAyIiwidXNlcl9pZCI6ImU1Y2VmNzEyLTU4NzAtNGE4NC1iZmQ0LThlMTc4MzdmNzUzYSIsIm5hbWUiOiJtaWtpYXMiLCJwaG9uZV9udW1iZXIiOiIyNTE5MjMyMTM3NjgiLCJiYWxhbmNlIjo5MC4wfQ.T4aKu1iPqeGDQzXF8hE2A2nSlVo_hhEhB5VQDm0w0JA' \
  -H 'content-type: application/json' \
  -H 'origin: https://novacasino.games' \
  -H 'priority: u=1, i' \
  -H 'referer: https://novacasino.games/' \
  -H 'sec-ch-ua: "Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' \
  --data-raw '{}'

  {
    "id": 5,
    "value": 0,
    "name": "Try Again",
    "reward_type": "No Reward",
    "reward_value": 0
}