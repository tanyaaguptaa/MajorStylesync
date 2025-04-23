from flask import Flask, render_template, request, redirect, jsonify
import base64
import os
import cv2
import numpy as np
from werkzeug.utils import secure_filename
from skin_tone import get_complexion
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------------------- UI Routes ----------------------------
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return redirect(request.url)

    file = request.files['image']
    if file.filename == '':
        return redirect(request.url)

    if file:
        filename = secure_filename(file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(image_path)  # Save the uploaded image

        complexion = get_complexion(image_path)  # Get the complexion from the uploaded image
        recommendations = get_recommendations(complexion)  # Get recommendations based on complexion

        return jsonify({'complexion': complexion, 'images': recommendations})

@app.route('/camera', methods=['POST'])
def camera():
    data_url = request.form['camera_image']
    header, encoded = data_url.split(",", 1)  # Split the base64 string
    data = base64.b64decode(encoded)  # Decode the image from base64
    filename = os.path.join(app.config['UPLOAD_FOLDER'], 'camera_capture.png')

    with open(filename, 'wb') as f:
        f.write(data)  # Save the image

    complexion = get_complexion(filename)  # Process the image for complexion
    return jsonify({'complexion': complexion, 'images': get_recommendations(complexion)})


def get_recommendations(complexion):
    if complexion == "light":
        return ["/static/clothes/warm1.webp", "/static/clothes/light2.jpg"]
    elif complexion == "medium":
        return ["/static/clothes/medium1.jpg", "/static/clothes/medium2.jpg"]
    else:
        return ["/static/clothes/dark1.jpg", "/static/clothes/dark2.jpg"]

# ---------------------------- Size Recommendation APIs ----------------------------

@app.route('/shirt-size', methods=['POST'])
def recommend_shirt_size():
    data = request.json
    chest = float(data['chest'])
    front_len = float(data['front_len'])
    shoulder = float(data['shoulder'])

    chart_dict = {
        'size': ['S', 'M', 'L', 'XL', 'XXL'],
        'chest': [34, 36, 38, 40, 42],
        'front_length': [23.5, 24, 24.5, 25, 25.5],
        'shoulder': [14, 14.5, 15, 15.5, 16]
    }

    min_error = float('inf')
    recom_size = chart_dict['size'][0]

    for i in range(len(chart_dict['size'])):
        chest_diff = abs(chest - chart_dict['chest'][i])
        front_len_diff = abs(front_len - chart_dict['front_length'][i])
        shoulder_diff = abs(shoulder - chart_dict['shoulder'][i])
        total_diff = chest_diff + front_len_diff + shoulder_diff

        if total_diff < min_error:
            min_error = total_diff
            recom_size = chart_dict['size'][i]

    return jsonify({'recommended_shirt_size': recom_size})


@app.route('/waist-size', methods=['POST'])
def recommend_waist_size():
    data = request.json
    waist = float(data['waist'])
    front_length = float(data['front_length'])

    chart_dict = {
        'size': ['S', 'M', 'L', 'XL', 'XXL'],
        'waist': [28, 30, 32, 34, 36],
        'front length': [30, 32, 34, 36, 38]
    }

    min_error = float('inf')
    recom_size = chart_dict['size'][0]

    for i in range(len(chart_dict['size'])):
        waist_diff = abs(waist - chart_dict['waist'][i])
        front_length_diff = abs(front_length - chart_dict['front length'][i])
        total_diff = waist_diff + front_length_diff

        if total_diff < min_error:
            min_error = total_diff
            recom_size = chart_dict['size'][i]

    return jsonify({'recommended_waist_size': recom_size})


@app.route('/kurti-size', methods=['POST'])
def recommend_kurti_size():
    data = request.json
    bust = float(data['bust'])
    waist = float(data['waist'])
    hip = float(data['hip'])
    length = float(data['length'])

    chart_dict = {
        'size': ['S', 'M', 'L', 'XL', 'XXL'],
        'bust': [36, 38, 40, 42, 44],
        'waist': [30, 32, 34, 36, 38],
        'hip': [38, 40, 42, 44, 46],
        'length': [40, 42, 44, 46, 48]
    }

    min_error = float('inf')
    recom_size = chart_dict['size'][0]

    for i in range(len(chart_dict['size'])):
        bust_diff = abs(bust - chart_dict['bust'][i])
        waist_diff = abs(waist - chart_dict['waist'][i])
        hip_diff = abs(hip - chart_dict['hip'][i])
        length_diff = abs(length - chart_dict['length'][i])
        total_diff = bust_diff + waist_diff + hip_diff + length_diff

        if total_diff < min_error:
            min_error = total_diff
            recom_size = chart_dict['size'][i]

    return jsonify({'recommended_kurti_size': recom_size})


@app.route('/kurta-set-size', methods=['POST'])
def recommend_kurta_set_size():
    data = request.json
    bust = float(data['bust'])
    waist = float(data['waist'])
    hip = float(data['hip'])
    length = float(data['length'])
    bottom_waist = float(data['bottom_waist'])
    bottom_length = float(data['bottom_length'])

    chart_dict = {
        'size': ['S', 'M', 'L', 'XL', 'XXL'],
        'bust': [36, 38, 40, 42, 44],
        'waist': [30, 32, 34, 36, 38],
        'hip': [38, 40, 42, 44, 46],
        'length': [40, 42, 44, 46, 48],
        'bottom_waist': [30, 32, 34, 36, 38],
        'bottom_length': [38, 40, 42, 44, 46]
    }

    min_error = float('inf')
    recom_size = chart_dict['size'][0]

    for i in range(len(chart_dict['size'])):
        bust_diff = abs(bust - chart_dict['bust'][i])
        waist_diff = abs(waist - chart_dict['waist'][i])
        hip_diff = abs(hip - chart_dict['hip'][i])
        length_diff = abs(length - chart_dict['length'][i])
        bottom_waist_diff = abs(bottom_waist - chart_dict['bottom_waist'][i])
        bottom_length_diff = abs(bottom_length - chart_dict['bottom_length'][i])
        total_diff = bust_diff + waist_diff + hip_diff + length_diff + bottom_waist_diff + bottom_length_diff

        if total_diff < min_error:
            min_error = total_diff
            recom_size = chart_dict['size'][i]

    return jsonify({'recommended_kurta_set_size': recom_size})


@app.route('/lehenga-size', methods=['POST'])
def recommend_lehenga_size():
    data = request.json
    bust = float(data['bust'])
    waist = float(data['waist'])
    hip = float(data['hip'])
    blouse_length = float(data['blouse_length'])
    lehenga_length = float(data['lehenga_length'])

    chart_dict = {
        'size': ['S', 'M', 'L', 'XL', 'XXL'],
        'bust': [34, 36, 38, 40, 42],
        'waist': [28, 30, 32, 34, 36],
        'hip': [36, 38, 40, 42, 44],
        'blouse_length': [14, 15, 16, 17, 18],
        'lehenga_length': [38, 40, 42, 44, 46]
    }

    min_error = float('inf')
    recom_size = chart_dict['size'][0]

    for i in range(len(chart_dict['size'])):
        bust_diff = abs(bust - chart_dict['bust'][i])
        waist_diff = abs(waist - chart_dict['waist'][i])
        hip_diff = abs(hip - chart_dict['hip'][i])
        blouse_length_diff = abs(blouse_length - chart_dict['blouse_length'][i])
        lehenga_length_diff = abs(lehenga_length - chart_dict['lehenga_length'][i])
        total_diff = bust_diff + waist_diff + hip_diff + blouse_length_diff + lehenga_length_diff

        if total_diff < min_error:
            min_error = total_diff
            recom_size = chart_dict['size'][i]

    return jsonify({'recommended_lehenga_size': recom_size})


# ---------------------------- Run Server ----------------------------
if __name__ == '__main__':
    app.run(debug=True, port=8000)
    
    
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# @app.route('/shirt-size', methods=['POST'])
# def recommend_shirt_size():
#     data = request.json
#     chest = float(data['chest'])
#     front_len = float(data['front_len'])
#     shoulder = float(data['shoulder'])

#     chart_dict = {
#         'size': ['S', 'M', 'L', 'XL', 'XXL'],
#         'chest': [34, 36, 38, 40, 42],
#         'front_length': [23.5, 24, 24.5, 25, 25.5],
#         'shoulder': [14, 14.5, 15, 15.5, 16]
#     }

#     min_error = float('inf')
#     recom_size = chart_dict['size'][0]

#     for i in range(len(chart_dict['size'])):
#         chest_diff = abs(chest - chart_dict['chest'][i])
#         front_len_diff = abs(front_len - chart_dict['front_length'][i])
#         shoulder_diff = abs(shoulder - chart_dict['shoulder'][i])

#         total_diff = chest_diff + front_len_diff + shoulder_diff

#         if total_diff < min_error:
#             min_error = total_diff
#             recom_size = chart_dict['size'][i]

#     return jsonify({'recommended_shirt_size': recom_size})


# @app.route('/waist-size', methods=['POST'])
# def recommend_waist_size():
#     data = request.json
#     waist = float(data['waist'])
#     front_length = float(data['front_length'])

#     chart_dict = {
#         'size': ['S', 'M', 'L', 'XL', 'XXL'],
#         'waist': [28, 30, 32, 34, 36],
#         'front length': [30, 32, 34, 36, 38]
#     }

#     min_error = float('inf')
#     recom_size = chart_dict['size'][0]

#     for i in range(len(chart_dict['size'])):
#         waist_diff = abs(waist - chart_dict['waist'][i])
#         front_length_diff = abs(front_length - chart_dict['front length'][i])
        
#         total_diff = waist_diff + front_length_diff 

#         if total_diff < min_error:
#             min_error = total_diff
#             recom_size = chart_dict['size'][i]

#     return jsonify({'recommended_waist_size': recom_size})


# @app.route('/kurti-size', methods=['POST'])
# def recommend_kurti_size():
#     data = request.json
#     bust = float(data['bust'])
#     waist = float(data['waist'])
#     hip = float(data['hip'])
#     length = float(data['length'])

#     chart_dict = {
#         'size': ['S', 'M', 'L', 'XL', 'XXL'],
#         'bust': [36, 38, 40, 42, 44],
#         'waist': [30, 32, 34, 36, 38],
#         'hip': [38, 40, 42, 44, 46],
#         'length': [40, 42, 44, 46, 48]
#     }

#     min_error = float('inf')
#     recom_size = chart_dict['size'][0]

#     for i in range(len(chart_dict['size'])):
#         bust_diff = abs(bust - chart_dict['bust'][i])
#         waist_diff = abs(waist - chart_dict['waist'][i])
#         hip_diff = abs(hip - chart_dict['hip'][i])
#         length_diff = abs(length - chart_dict['length'][i])

#         total_diff = bust_diff + waist_diff + hip_diff + length_diff

#         if total_diff < min_error:
#             min_error = total_diff
#             recom_size = chart_dict['size'][i]

#     return jsonify({'recommended_kurti_size': recom_size})


# @app.route('/kurta-set-size', methods=['POST'])
# def recommend_kurta_set_size():
#     data = request.json
#     bust = float(data['bust'])
#     waist = float(data['waist'])
#     hip = float(data['hip'])
#     length = float(data['length'])
#     bottom_waist = float(data['bottom_waist'])
#     bottom_length = float(data['bottom_length'])

#     chart_dict = {
#         'size': ['S', 'M', 'L', 'XL', 'XXL'],
#         'bust': [36, 38, 40, 42, 44],
#         'waist': [30, 32, 34, 36, 38],
#         'hip': [38, 40, 42, 44, 46],
#         'length': [40, 42, 44, 46, 48],
#         'bottom_waist': [30, 32, 34, 36, 38],
#         'bottom_length': [38, 40, 42, 44, 46]
#     }

#     min_error = float('inf')
#     recom_size = chart_dict['size'][0]

#     for i in range(len(chart_dict['size'])):
#         bust_diff = abs(bust - chart_dict['bust'][i])
#         waist_diff = abs(waist - chart_dict['waist'][i])
#         hip_diff = abs(hip - chart_dict['hip'][i])
#         length_diff = abs(length - chart_dict['length'][i])
#         bottom_waist_diff = abs(bottom_waist - chart_dict['bottom_waist'][i])
#         bottom_length_diff = abs(bottom_length - chart_dict['bottom_length'][i])

#         total_diff = bust_diff + waist_diff + hip_diff + length_diff + bottom_waist_diff + bottom_length_diff

#         if total_diff < min_error:
#             min_error = total_diff
#             recom_size = chart_dict['size'][i]

#     return jsonify({'recommended_kurta_set_size': recom_size})


# @app.route('/lehenga-size', methods=['POST'])
# def recommend_lehenga_size():
#     data = request.json
#     bust = float(data['bust'])
#     waist = float(data['waist'])
#     hip = float(data['hip'])
#     blouse_length = float(data['blouse_length'])
#     lehenga_length = float(data['lehenga_length'])

#     chart_dict = {
#         'size': ['S', 'M', 'L', 'XL', 'XXL'],
#         'bust': [34, 36, 38, 40, 42],
#         'waist': [28, 30, 32, 34, 36],
#         'hip': [36, 38, 40, 42, 44],
#         'blouse_length': [14, 15, 16, 17, 18],
#         'lehenga_length': [38, 40, 42, 44, 46]
#     }

#     min_error = float('inf')
#     recom_size = chart_dict['size'][0]

#     for i in range(len(chart_dict['size'])):
#         bust_diff = abs(bust - chart_dict['bust'][i])
#         waist_diff = abs(waist - chart_dict['waist'][i])
#         hip_diff = abs(hip - chart_dict['hip'][i])
#         blouse_length_diff = abs(blouse_length - chart_dict['blouse_length'][i])
#         lehenga_length_diff = abs(lehenga_length - chart_dict['lehenga_length'][i])

#         total_diff = bust_diff + waist_diff + hip_diff + blouse_length_diff + lehenga_length_diff

#         if total_diff < min_error:
#             min_error = total_diff
#             recom_size = chart_dict['size'][i]

#     return jsonify({'recommended_lehenga_size': recom_size})


# if __name__ == '__main__':
#     app.run(debug=True, port=8000)

# # from flask import Flask, request, jsonify
# # from flask_cors import CORS

# # app = Flask(__name__)
# # CORS(app)

# # @app.route('/shirt-size', methods=['POST'])
# # def recommend_shirt_size():
# #     data = request.json
# #     chest = float(data['chest'])
# #     front_len = float(data['front_len'])
# #     shoulder = float(data['shoulder'])

# #     chart_dict = {
# #         'size': ['S', 'M', 'L', 'XL', 'XXL'],
# #         'chest': [34, 36, 38, 40, 42],
# #         'front_length': [23.5, 24, 24.5, 25, 25.5],
# #         'shoulder': [14, 14.5, 15, 15.5, 16]
# #     }

# #     min_error = float('inf')
# #     recom_size = chart_dict['size'][0]

# #     for i in range(len(chart_dict['size'])):
# #         chest_diff = abs(chest - chart_dict['chest'][i])
# #         front_len_diff = abs(front_len - chart_dict['front_length'][i])
# #         shoulder_diff = abs(shoulder - chart_dict['shoulder'][i])

# #         total_diff = chest_diff + front_len_diff + shoulder_diff

# #         if total_diff < min_error:
# #             min_error = total_diff
# #             recom_size = chart_dict['size'][i]

# #     return jsonify({'recommended_shirt_size': recom_size})


# # @app.route('/waist-size', methods=['POST'])
# # def recommend_waist_size():
# #     data = request.json
# #     waist = float(data['waist'])
# #     frontLength = float(data['front length'])

# #     chart_dict = {
# #         'size': ['S', 'M', 'L', 'XL', 'XXL'],
# #         'waist': [28, 30, 32, 34, 36],
# #         'front length': [30, 32, 34, 36, 38]
# #     }

# #     min_error = float('inf')
# #     recom_size = chart_dict['size'][0]

# #     for i in range(len(chart_dict['size'])):
# #         waist_diff = abs(waist - chart_dict['waist'][i])
# #         frontLength_diff = abs(frontLength - chart_dict['front length'][i])
        

# #         total_diff = waist_diff + frontLength_diff 

# #         if total_diff < min_error:
# #             min_error = total_diff
# #             recom_size = chart_dict['size'][i]

# #     return jsonify({'recommended_waist_size': recom_size})


# # if __name__ == '__main__':
# #     app.run(debug=True, port=8000)