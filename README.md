# Pet Management System

A Flask and MongoDB app for keeping pet records: user sign-up and login, a pet-adoption styled frontend ("PAW FINDERS"), and a REST API for creating, listing, updating and deleting pets.

`server.py` does both jobs: it serves the static pages from `public/` and exposes the JSON API, backed by a local MongoDB (`mongodb://localhost:27017`, database `petRegistry`).

## How it works

**Collections**

- `user_details`: `username`, `email`, hashed `password` (werkzeug), optional `contact` and `country`, `createdAt`. Email is the unique key; registering an existing email is rejected.
- `pets`: the fields sent by the entry form (species, breed, gender, and optional age, colour, weight, owner, contact, description, location, photo), plus `createdAt` and a generated `petId`.

**API**

| Method | Route | What it does |
|---|---|---|
| POST | `/api/register` | Create a user |
| POST | `/api/login` | Check email and password, return `userId` and `username` |
| POST | `/api/pets` | Create a pet |
| GET | `/api/pets` | List all pets |
| GET | `/api/pets/<petId>` | Fetch one pet |
| PUT | `/api/pets/<petId>` | Update only the fields that are sent |
| DELETE | `/api/pets/<petId>` | Delete a pet |

Pet IDs are readable rather than ObjectIds: species and breed capitalised, gender reduced to `M` or `F` (it accepts `male`, `female`, `m`, `f`), then four random digits, for example `DogLabradorM1234`. Species, breed and gender are required.

**Frontend**

Plain HTML, CSS and JavaScript, no build step. The flow is login, home, entry, pet list, update. `petlist.html` with `updated-petlist.js` fetches `/api/pets`, or `/api/pets/<id>` when an `id` query parameter is present, and renders cards with a search box for a Pet ID. After login the username is kept in `localStorage`.

If the port is busy, `start_server()` retries on the next one.

## Stack

Python, Flask, Flask-CORS, pymongo, Bootstrap, Owl Carousel, animate.css, Font Awesome.

## Setup

You need Python 3 and MongoDB running on `localhost:27017`. The repo has no `requirements.txt`, so install the dependencies directly:

```bash
pip install flask pymongo flask-cors werkzeug
python server.py
```

Open http://localhost:5000 (override the port with `PORT`). Register a user, log in, and add a pet from the entry page. You can also use the API directly:

```bash
curl -X POST http://localhost:5000/api/pets \
  -H "Content-Type: application/json" \
  -d '{"species":"dog","breed":"labrador","gender":"male"}'
```

## Structure

```
server.py     Flask app: API, static serving, MongoDB
public/       HTML pages, updated-petlist.js, css/
```

## Known issues

Some pages reference assets that are not in the repo (`lib/`, `img/`, `js/main.js`), and `entry.html` posts to a hardcoded `http://localhost:5000`. Passwords are hashed, but there are no sessions or tokens, so the API itself is unauthenticated.
