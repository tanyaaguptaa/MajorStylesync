import cv2
import numpy as np
from sklearn.cluster import KMeans
from collections import Counter
import imutils
import mediapipe as mp

# Initialize MediaPipe face mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True)

def get_cheek_region(image):
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_image)
    if not results.multi_face_landmarks:
        return None

    h, w, _ = image.shape
    face_landmarks = results.multi_face_landmarks[0]

    # Left cheek points (can be adjusted for more coverage)
    cheek_points = [234, 93, 132, 58, 172]
    cheek_coords = [(int(face_landmarks.landmark[i].x * w), int(face_landmarks.landmark[i].y * h)) for i in cheek_points]

    # Create cheek mask
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.fillConvexPoly(mask, np.array(cheek_coords, dtype=np.int32), 255)
    cheek_region = cv2.bitwise_and(image, image, mask=mask)

    # Save debug cheek image
    cv2.imwrite("debug_cheek.jpg", cheek_region)

    return cheek_region

def removeBlack(estimator_labels, estimator_cluster):
    compare = lambda x, y: Counter(x) == Counter(y)
    occurance_counter = Counter(estimator_labels)
    for x in occurance_counter.most_common(len(estimator_cluster)):
        color = [int(i) for i in estimator_cluster[x[0]].tolist()]
        if compare(color , [0,0,0]):
            del occurance_counter[x[0]]
            estimator_cluster = np.delete(estimator_cluster,x[0],0)
            break
    return (occurance_counter,estimator_cluster)

def getColorInformation(estimator_labels, estimator_cluster):
    occurance_counter = Counter(estimator_labels)
    totalOccurance = sum(occurance_counter.values())
    colorInformation = []
    for x in occurance_counter.most_common(len(estimator_cluster)):
        color = estimator_cluster[x[0]].tolist()
        color_percentage = (x[1]/totalOccurance)
        colorInfo = {"color": color, "percentage" : color_percentage }
        colorInformation.append(colorInfo)
    return colorInformation

def extractDominantColor(image):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = image.reshape((image.shape[0]*image.shape[1]), 3)

    # Remove black pixels
    image = image[~np.all(image == [0, 0, 0], axis=1)]

    estimator = KMeans(n_clusters=3, random_state=0)
    estimator.fit(image)
    colorInfo = getColorInformation(estimator.labels_, estimator.cluster_centers_)
    return colorInfo

def get_complexion(image_path):
    image = cv2.imread(image_path)
    image = imutils.resize(image, width=300)

    cheek = get_cheek_region(image)
    if cheek is None:
        return "medium"  # fallback

    dominant = extractDominantColor(cheek)
    dom = dominant[0]['color']
    r, g, b = dom

    print("Dominant color RGB:", r, g, b)

    # More flexible thresholds
    if r > 210 and g > 170 and b > 150:
        return "light"
    elif r > 160 and g > 120 and b > 100:
        return "medium"
    else:
        return "dark"