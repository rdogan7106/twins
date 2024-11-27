from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import jwt
from datetime import datetime ,timedelta
from functools import wraps
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import base64
from sklearn.metrics.pairwise import cosine_similarity
import insightface
from insightface.app import FaceAnalysis
import mediapipe as mp
import matplotlib.pyplot as plt
from io import BytesIO
from mpl_toolkits.mplot3d import Axes3D




app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///twinsapp.db'
app.config['SECRET_KEY'] = 'supersecretkey'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

fer_model = load_model('best_fer_model.keras')
utk_model = load_model('best_utk_model.keras')

face_app = FaceAnalysis()
face_app.prepare(ctx_id=0, det_size=(640, 640))

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh()

""" DATABASE MODELS """
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    self_image = db.Column(db.Text, nullable=True) 
    images = db.relationship('Image', backref='user', lazy=True)
    comparisons = db.relationship('Comparison', backref='user', lazy=True)

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    image_data = db.Column(db.Text, nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    emotion = db.Column(db.String(20))
    ethnicity = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Comparison(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    similarity_score = db.Column(db.Float, nullable=True)  
    image1_id = db.Column(db.Integer, db.ForeignKey('image.id'), nullable=False)
    image2_id = db.Column(db.Integer, db.ForeignKey('comparison_image.id'), nullable=False)
    image1 = db.relationship('Image', foreign_keys=[image1_id])
    image2 = db.relationship('ComparisonImage', foreign_keys=[image2_id])
    

class ComparisonImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    image_data = db.Column(db.Text, nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    emotion = db.Column(db.String(20))
    ethnicity = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    comparisons = db.relationship('Comparison', backref='comparison_image', lazy=True)

with app.app_context():
    db.create_all()

""" HELPER FUNCTIONS """
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):        
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401

        return f(current_user, *args, **kwargs)
    return decorated

def predict_attributes(fer_model, utk_model, frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    result = []
    for (x, y, w, h) in faces:
        face = gray[y:y+h, x:x+w]
        face = cv2.resize(face, (48, 48))
        face = face.astype('float32') / 255.0
        face = np.expand_dims(face, axis=-1)
        face = np.expand_dims(face, axis=0)

        expression_pred = fer_model.predict(face, verbose=0)
        expression_label = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'][np.argmax(expression_pred)]

        age_pred, gender_pred, ethnicity_pred = utk_model.predict(face, verbose=0)
        age = int(age_pred[0][0])
        gender = 'Male' if gender_pred[0][0] > 0.5 else 'Female'
        ethnicity_label = ['White', 'Black', 'Asian', 'Indian', 'Others'][np.argmax(ethnicity_pred)]

        result.append({
            "expression": expression_label,
            "age": age,
            "gender": gender,
            "ethnicity": ethnicity_label
        })

    return result

def calculate_similarity(image1_data, image2_data):
    img1 = cv2.imdecode(np.frombuffer(base64.b64decode(image1_data.split(',')[1]), np.uint8), cv2.IMREAD_COLOR)
    img2 = cv2.imdecode(np.frombuffer(base64.b64decode(image2_data.split(',')[1]), np.uint8), cv2.IMREAD_COLOR)

    faces1 = face_app.get(img1)
    faces2 = face_app.get(img2)

    if len(faces1) == 0 or len(faces2) == 0:
        return 0 

    face1_embedding = faces1[0].embedding
    face2_embedding = faces2[0].embedding

    
    similarity = cosine_similarity([face1_embedding], [face2_embedding])[0][0]
    return float(similarity * 100)

def extract_3d_face(image):
    results = face_mesh.process(image)
    face_3d = []
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            for landmark in face_landmarks.landmark:
                face_3d.append([landmark.x, landmark.y, landmark.z])
    return face_3d

def array_to_image(face_3d_array):
    face_3d_array = np.array(face_3d_array)
    
    img = np.zeros((500, 500, 3), dtype=np.uint8)    
    x = (face_3d_array[:, 0] * 500).astype(int)
    y = (face_3d_array[:, 1] * 500).astype(int)
    z = face_3d_array[:, 2]
    
    z_normalized = ((z - z.min()) / (z.max() - z.min()) * 255).astype(int)
    
    for i in range(len(x)):
       cv2.circle(img, (x[i], y[i]), 2, (int(z_normalized[i]), 255, 255), -1)

    _, buffer = cv2.imencode('.png', img)
    base64_image = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/png;base64,{base64_image}"  

""" ROUTES """
@app.route('/createuser', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify({'message': 'Username, email and password are required!'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists!'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password, email=email)
    db.session.add(new_user)
    db.session.commit()

    token = jwt.encode({'user_id': new_user.id, 'exp': datetime.utcnow() + timedelta(hours=24)},
                       app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'message': 'User created!', 'token': token})

@app.route('/user/update-user', methods=['PUT'])
@token_required
def update_user(current_user):
    user = User.query.get(current_user.id)

    if not user:
        return jsonify({'message': 'User not found!'}), 404

    data = request.json
    new_password = data.get('password')
    new_profile_image = data.get('self_image')
    current_password = data.get('current_password')

    if new_password:
        if not current_password or not bcrypt.check_password_hash(user.password, current_password):
            return jsonify({'message': 'Current password is incorrect!'}), 403

        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.password = hashed_password

    if new_profile_image:
        try:
            user.self_image = new_profile_image  
        except Exception as e:
            return jsonify({'message': 'Failed to update profile image', 'error': str(e)}), 400

    db.session.commit()

    updated_user = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'self_image': user.self_image
    }

    return jsonify({'message': 'User updated successfully!', 'user': updated_user}), 200


@app.route('/user/get-user', methods=['GET'])
@token_required  
def get_user(current_user):
    user = User.query.get(current_user.id)
    
    if not user:
        return jsonify({'message': 'User not found!'}), 404

    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'self_image': user.self_image  
    }

    return jsonify({'user': user_data})


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required!'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid username or password!'}), 401

    token = jwt.encode({'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=24)},
                       app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'message': 'Login successful!', 'token': token})

@app.route('/capture', methods=['POST'])
@token_required
def capture_and_predict(current_user):
    data = request.json
    image_data = data.get('image')
    is_self = data.get('is_self', True) 

    if not image_data:
        return jsonify({"message": "No image data provided"}), 400

    image_bytes = base64.b64decode(image_data.split(',')[1])
    np_array = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({"message": "Failed to process image"}), 400

    predictions = predict_attributes(fer_model, utk_model, frame)

    if not predictions:
        return jsonify({"message": "No face detected"}), 400

    for prediction in predictions:
        prediction['age'] = int(prediction['age'])
        prediction['similarity_score'] = float(prediction.get('similarity_score', 0))

    if is_self:       
        new_image = Image(
            user_id=current_user.id,
            image_data=image_data,
            age=predictions[0]['age'],
            gender=predictions[0]['gender'],
            emotion=predictions[0]['expression'],
            ethnicity=predictions[0]['ethnicity']
        )
        db.session.add(new_image)
        db.session.commit()

        predictions[0]['similarity_score'] = None
        return jsonify({"message": "User image saved", "image_id": new_image.id, "predictions": predictions})
    else:
        new_comparison_image = ComparisonImage(
            user_id=current_user.id,
            image_data=image_data,
            age=predictions[0]['age'],
            gender=predictions[0]['gender'],
            emotion=predictions[0]['expression'],
            ethnicity=predictions[0]['ethnicity']
        )
        db.session.add(new_comparison_image)
        db.session.commit()

        user_image = Image.query.filter_by(user_id=current_user.id).order_by(Image.created_at.desc()).first()

        if not user_image:
            return jsonify({"message": "No user image found for comparison"}), 400
        
        similarity_score = calculate_similarity(user_image.image_data, new_comparison_image.image_data)

        new_comparison = Comparison(
            user_id=current_user.id,
            image1_id=user_image.id,
            image2_id=new_comparison_image.id,
            similarity_score=similarity_score

        )
        db.session.add(new_comparison)
        db.session.commit()
        predictions[0]['similarity_score'] = similarity_score

        return jsonify({"message": "Comparison image saved", "comparison_id": new_comparison.id, "predictions": predictions})


@app.route('/analyze_face', methods=['POST'])
def analyze_face():
    data = request.json
    image_data = data.get('image')

    if not image_data:
        return jsonify({"message": "No image data provided"}), 400

    image_bytes = base64.b64decode(image_data.split(',')[1])
    np_array = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({"message": "Failed to process image"}), 400

    predictions = predict_attributes(fer_model, utk_model, frame)

    if not predictions:
        return jsonify({"message": "No face detected"}), 400

    face_3d = extract_3d_face(frame)
    face_3d_image = array_to_image(face_3d)

    result = {
        "original_image": image_data,
        "face_3d": face_3d_image,
        "predictions": {
            "age": int(predictions[0]['age']),
            "gender": predictions[0]['gender'],
            "expression": predictions[0]['expression'],
            "ethnicity": predictions[0]['ethnicity']
        }
    }

    return jsonify(result)



@app.route('/user-comparisons', methods=['GET'])
@token_required
def user_comparisons(current_user):
    comparisons = Comparison.query.filter_by(user_id=current_user.id).all()
    results = []
    for comparison in comparisons:
        if comparison.image2:  
            results.append({
                'comparison_id': comparison.id,
                'similarity_score': comparison.similarity_score,
                'comparison_image': {
                    'image_data': comparison.image2.image_data,
                    'age': comparison.image2.age,
                    'gender': comparison.image2.gender,
                    'emotion': comparison.image2.emotion,
                    'ethnicity': comparison.image2.ethnicity
                }
            })
        else:
            print(f"Comparison ID {comparison.id} has no image2.")
    return jsonify(results)


@app.route('/comparison-details', methods=['GET'])
@token_required
def comparison_details(current_user):
    comparisons = Comparison.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'comparison_id': comparison.id,
        'similarity_score': comparison.similarity_score,
        'user_uploaded_image': {
            'image_data': comparison.image1.image_data,
            'age': comparison.image1.age,
            'gender': comparison.image1.gender,
            'emotion': comparison.image1.emotion,
            'ethnicity': comparison.image1.ethnicity
        },
        'comparison_image': {
            'image_data': comparison.image2.image_data,
            'age': comparison.image2.age,
            'gender': comparison.image2.gender,
            'emotion': comparison.image2.emotion,
            'ethnicity': comparison.image2.ethnicity
        }
    } for comparison in comparisons])


@app.route('/delete-comparison/<int:comparison_id>', methods=['DELETE'])
@token_required
def delete_comparison(current_user, comparison_id):
    comparison = Comparison.query.filter_by(id=comparison_id, user_id=current_user.id).first()

    if not comparison:
        return jsonify({'message': 'Comparison not found or not authorized'}), 404
    image1 = Image.query.filter_by(id=comparison.image1_id).first()
    image2 = ComparisonImage.query.filter_by(id=comparison.image2_id).first()
    try:
        db.session.delete(comparison)

        if image1:
            db.session.delete(image1)
        if image2:
            db.session.delete(image2)

        db.session.commit() 

        return jsonify({'message': 'Comparison and associated images deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()  
        return jsonify({'message': f'Error deleting comparison: {str(e)}'}), 500


@app.route('/delete-user', methods=['DELETE'])
@token_required
def delete_user(current_user):
    try:
        comparisons = Comparison.query.filter_by(user_id=current_user.id).all()
        for comparison in comparisons:
            image1 = Image.query.filter_by(id=comparison.image1_id).first()
            image2 = ComparisonImage.query.filter_by(id=comparison.image2_id).first()

            if image1:
                db.session.delete(image1)
            if image2:
                db.session.delete(image2)

            db.session.delete(comparison)  
        db.session.delete(current_user)
        db.session.commit()

        return jsonify({'message': 'User and all related data deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()  
        return jsonify({'message': f'Error deleting user: {str(e)}'}), 500

""" MAIN """
if __name__ == '__main__':
    app.run(debug=True)
