# Pet Management System

**A Flask + MongoDB web app for keeping pet records — owner sign-up, a "PAW FINDERS" adoption-style frontend, and a full CRUD REST API behind it.**

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat&logo=bootstrap&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

## Overview

Pet Management System is a small full-stack app for tracking pets — the kind of registry a pet owner, a vet clinic, or an animal shelter might keep. A user registers and logs in, lands on a "PAW FINDERS" adoption-themed home page, then adds pets, browses them as cards, searches by Pet ID, and edits or removes records.

The backend is a single Flask file (`server.py`) that does two jobs: it serves the static HTML/CSS/JS frontend and exposes a JSON REST API on top of MongoDB. Passwords are hashed with werkzeug before they touch the database, and every new pet gets a generated, human-readable ID built from its species, breed, gender, and four random digits. I built it as a college full-stack project to practice wiring a multi-page frontend to a Flask + MongoDB backend end to end.

## Key Features

- User registration and login, with passwords hashed via `werkzeug.security` (`generate_password_hash` / `check_password_hash`) — plaintext passwords are never stored.
- Full CRUD for pet records: create, list all, fetch one by ID, update, and delete.
- Auto-generated Pet IDs in the form `{Species}{Breed}{Gender}{4 digits}` — e.g. a male Labrador becomes `DogLabradorM1234`.
- Gender input is normalized — it accepts `male`/`female`/`m`/`f` (any case) and stores it as `M` or `F`.
- A multi-page "PAW FINDERS" frontend: login, register, an animated adoption-style home page, a pet-entry form, a pet list, and an update page.
- Pet list renders each pet as a card and switches to a richer single-pet detail layout (image, ID, age, color, weight, owner, contact, description, location) when an ID is in the URL.
- Search box on the pet list that looks up a pet by typed Pet ID.
- CORS enabled (Flask-CORS) so the frontend can call the API cross-origin.
- Server auto-increments the port if the default one is already in use, instead of crashing.
- Partial updates: the update endpoint only writes the fields you actually send, leaving the rest untouched.

## How It Works

The whole thing is one Flask process. `server.py` registers the static folder as `public/`, connects to a local MongoDB instance (`mongodb://localhost:27017`, database `petRegistry`), and serves both the pages and the API from the same origin on port 5000.

### Data model

Two MongoDB collections in the `petRegistry` database:

- `user_details` — `username`, `email`, hashed `password`, optional `contact` and `country`, and a `createdAt` timestamp. Email is treated as the unique key; registration rejects an already-registered email.
- `pets` — whatever pet fields the entry form sends (species, breed, gender, plus optional age/color/weight/owner/contact/description/location/photo), with a server-added `createdAt` and the generated `petId`.

### REST API

Seven JSON endpoints, all returning proper status codes (201 on create, 400 on bad input, 401 on bad login, 404 on missing pet, 500 on server error):

| Method | Route | What it does |
|---|---|---|
| POST | `/api/register` | Create a user (validates username/email/password, hashes password, blocks duplicate email) |
| POST | `/api/login` | Verify credentials against the stored hash, return `userId` + `username` |
| POST | `/api/pets` | Create a pet; validates species/breed/gender, normalizes gender, generates the Pet ID |
| GET | `/api/pets` | List all pets |
| GET | `/api/pets/<petId>` | Fetch one pet by its generated Pet ID |
| PUT | `/api/pets/<petId>` | Update a pet — only the non-null fields in the request are `$set` |
| DELETE | `/api/pets/<petId>` | Delete a pet by Pet ID |

The Pet ID is generated at creation time: species and breed are capitalized, gender is collapsed to `M`/`F`, and four random digits are appended (`random.choices(string.digits, k=4)`). That makes IDs both unique enough for a small registry and readable at a glance.

### Frontend page flow

The frontend is plain HTML/CSS/JS — no build step. The page flow is **login → home → entry → petlist → update**:

- **login.html / register.html** — POST to `/api/login` and `/api/register`. On a successful login the username is saved to `localStorage` and the user is redirected to `home.html`.
- **home.html** — the "PAW FINDERS - Premium Pet Adoption & Care" landing page. This is the styled marketing-style view, using Owl Carousel, animate.css, Font Awesome, Bootstrap Icons, Poppins/Roboto web fonts, and a custom CSS color palette (coral / teal / yellow with a floating-animation header).
- **entry.html** — the pet registration form; POSTs the pet object to `/api/pets`, then redirects to the pet list.
- **petlist.html + updated-petlist.js** — fetches `/api/pets` (or `/api/pets/<id>` when an `id` query param is present) and renders cards. With an ID present it draws the detailed single-pet card; it also injects a search form that redirects to `petlist.html?id=<petId>`. Empty and error states render their own messages.
- **update.html** — the edit screen backed by the PUT endpoint.

### Server resilience

`start_server()` wraps `app.run()` and catches `OSError` for "address already in use" (errno 98), then retries on the next port up. Small touch, but it means a stale process on 5000 doesn't block a restart.

## Highlights

- 7 REST endpoints over MongoDB, all returning correct HTTP status codes.
- Readable generated Pet IDs (`DogLabradorM1234`) instead of opaque ObjectIds.
- Password hashing on registration and login — no plaintext credentials in the DB.
- Auto port-increment so the server recovers from a busy port.
- A genuinely styled frontend (PAW FINDERS) rather than a bare form — carousel, animations, custom palette.

## Tech Stack

- **Languages:** Python, JavaScript, HTML, CSS
- **Backend:** Flask, Flask-CORS, `werkzeug.security` (password hashing)
- **Database:** MongoDB via `pymongo` (database `petRegistry`)
- **Frontend:** Bootstrap 5, vanilla JS (Fetch API), Owl Carousel, animate.css, Font Awesome, Bootstrap Icons, Google Fonts (Poppins / Roboto)

## Getting Started

### Prerequisites

- Python 3.x
- MongoDB running locally on `localhost:27017`

### Installation

```bash
git clone https://github.com/DCode-v05/Pet-Management-System.git
cd Pet-Management-System
# no requirements.txt in the repo — install the deps directly:
pip install flask pymongo flask-cors werkzeug
```

### Running

```bash
python server.py
```

Then open `http://localhost:5000` in your browser. The server serves `login.html` at `/` and binds to `0.0.0.0:5000` by default (override with the `PORT` env var; if the port is taken it tries the next one).

## Usage

1. Open the app and **register** a user (username, email, password; contact and country are optional), then **log in**.
2. From the home page go to the **pet entry** form and add a pet — species, breed, and gender are required. On save you'll get back the generated Pet ID (e.g. `CatPersianF8421`).
3. Browse all pets on the **pet list**, or type a Pet ID into the search box to pull up a single record.
4. Use the **update** page to edit a pet, or call `DELETE /api/pets/<petId>` to remove one.

The API can also be driven directly, e.g.:

```bash
curl -X POST http://localhost:5000/api/pets \
  -H "Content-Type: application/json" \
  -d '{"species":"dog","breed":"labrador","gender":"male"}'
```

## Project Structure

```
Pet-Management-System/
├── public/
│   ├── css/
│   │   ├── bootstrap.min.css     # Bootstrap 5 build
│   │   └── style.css             # custom styles
│   ├── login.html                # login form -> /api/login
│   ├── register.html             # signup form -> /api/register
│   ├── home.html                 # PAW FINDERS landing page (carousel + animations)
│   ├── entry.html                # add-a-pet form -> POST /api/pets
│   ├── petlist.html              # pet cards / search / single-pet view
│   ├── update.html               # edit a pet -> PUT /api/pets/<id>
│   └── updated-petlist.js        # fetches + renders pet cards, search form, states
├── server.py                     # Flask app: REST API + static serving + MongoDB
└── README.md
```

---

## Contact

**Portfolio:** [Denistan](https://www.denistan.me)<br>
**LinkedIn:** [Denistan](https://www.linkedin.com/in/denistanb)<br>
**GitHub:** [DCode-v05](https://github.com/DCode-v05)<br>
**LeetCode:** [Denistan_B](https://leetcode.com/u/Denistan_B)<br>
**Email:** [denistanb05@gmail.com](mailto:denistanb05@gmail.com)

Made with ❤️ by **Denistan B**
