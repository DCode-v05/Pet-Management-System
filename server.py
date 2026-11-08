from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime
from flask_cors import CORS
import random
import string

app = Flask(__name__, static_folder='public')
CORS(app)

default_port = int(os.environ.get('PORT', 5000))
mongo_url = 'mongodb://localhost:27017'
db_name = 'petRegistry'

client = MongoClient(mongo_url)
db = client[db_name]

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        contact = data.get('contact')
        country = data.get('country')

        if not all([username, email, password]):
            return jsonify({'error': 'Username, email, and password are required'}), 400

        if db.user_details.find_one({'email': email}):
            return jsonify({'error': 'Email already registered'}), 400

        hashed_password = generate_password_hash(password)

        user_data = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'contact': contact,
            'country': country,
            'createdAt': datetime.now()
        }
        result = db.user_details.insert_one(user_data)

        return jsonify({
            'message': 'User registered successfully',
            'userId': str(result.inserted_id)
        }), 201

    except Exception as e:
        print(f'Registration error: {e}')
        return jsonify({'error': 'Failed to register user'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'error': 'Email and password are required'}), 400

        user = db.user_details.find_one({'email': email})
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'error': 'Invalid email or password'}), 401

        return jsonify({
            'message': 'Login successful',
            'userId': str(user['_id']),
            'username': user['username']
        }), 200

    except Exception as e:
        print(f'Login error: {e}')
        return jsonify({'error': 'Failed to login'}), 500

@app.route('/api/pets', methods=['POST'])
def create_pet():
    try:
        pet_data = request.get_json()
        
        required_fields = ['species', 'breed', 'gender']
        if not all(pet_data.get(field) for field in required_fields):
            return jsonify({'error': 'Species, breed, and gender are required'}), 400
        
        gender = pet_data['gender'].lower()
        if gender not in ['male', 'female', 'm', 'f']:
            return jsonify({'error': 'Gender must be Male (M) or Female (F)'}), 400
        gender_abbr = 'M' if gender in ['male', 'm'] else 'F'
        
        species = pet_data['species'].capitalize()
        breed = pet_data['breed'].capitalize()
        random_nums = ''.join(random.choices(string.digits, k=4))
        custom_pet_id = f"{species}{breed}{gender_abbr}{random_nums}"
        
        pet_data['createdAt'] = datetime.now()
        pet_data['petId'] = custom_pet_id
        result = db.pets.insert_one(pet_data)
        
        return jsonify({
            'message': 'Pet registered successfully',
            'petId': custom_pet_id
        }), 201

    except Exception as e:
        print(f'Error saving pet: {e}')
        return jsonify({'error': 'Failed to register pet'}), 500

@app.route('/api/pets', methods=['GET'])
def get_pets():
    try:
        pets = list(db.pets.find())
        for pet in pets:
            pet['_id'] = str(pet['_id'])
        return jsonify(pets), 200

    except Exception as e:
        print(f'Error retrieving pets: {e}')
        return jsonify({'error': 'Failed to retrieve pets'}), 500

@app.route('/api/pets/<id>', methods=['GET'])
def get_pet(id):
    try:
        pet = db.pets.find_one({'petId': id})
        if not pet:
            return jsonify({'error': 'Pet not found'}), 404
        
        pet['_id'] = str(pet['_id'])
        return jsonify(pet), 200

    except ValueError:
        return jsonify({'error': 'Invalid Pet ID'}), 400
    except Exception as e:
        print(f'Error fetching pet: {e}')
        return jsonify({'error': 'Failed to fetch pet'}), 500

@app.route('/api/pets/<id>', methods=['PUT'])
def update_pet(id):
    try:
        pet_id = id
        pet_data = request.get_json()
        
        updated_pet = {k: v for k, v in pet_data.items() if v is not None}

        result = db.pets.update_one(
            {'petId': pet_id},
            {'$set': updated_pet}
        )

        if result.matched_count == 0:
            return jsonify({'error': 'Pet not found'}), 404

        return jsonify({'message': 'Pet updated successfully'}), 200

    except ValueError:
        return jsonify({'error': 'Invalid Pet ID'}), 400
    except Exception as e:
        print(f'Error updating pet: {e}')
        return jsonify({'error': 'Failed to update pet'}), 500

@app.route('/api/pets/<id>', methods=['DELETE'])
def delete_pet(id):
    try:
        result = db.pets.delete_one({'petId': id})

        if result.deleted_count == 0:
            return jsonify({'error': 'Pet not found'}), 404

        return jsonify({'message': 'Pet deleted successfully'}), 200

    except Exception as e:
        print(f'Error deleting pet: {e}')
        return jsonify({'error': 'Failed to delete pet'}), 500

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'login.html')

@app.route('/login.html')
def login_page():
    return send_from_directory(app.static_folder, 'login.html')

@app.route('/register.html')
def register_page():
    return send_from_directory(app.static_folder, 'register.html')

@app.route('/entry.html')
def entry_page():
    return send_from_directory(app.static_folder, 'entry.html')

@app.route('/petlist.html')
def petlist():
    return send_from_directory(app.static_folder, 'petlist.html')

@app.route('/update.html')
def update_page():
    return send_from_directory(app.static_folder, 'update.html')

@app.route('/home.html')
def home_page():
    return send_from_directory(app.static_folder, 'home.html')

@app.errorhandler(Exception)
def handle_exception(e):
    print(f'Error: {e}')
    return jsonify({'error': 'Something went wrong!'}), 500

def start_server(port=default_port):
    try:
        app.run(host='0.0.0.0', port=port, debug=True)
    except OSError as e:
        if e.errno == 98:
            print(f'Port {port} is in use, trying port {port + 1}...')
            start_server(port + 1)
        else:
            print(f'Server error: {e}')
            raise

if __name__ == '__main__':
    print(f'Server running on port {default_port}')
    start_server()