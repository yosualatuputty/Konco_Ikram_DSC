import torch
import sys
from ultralytics import YOLO  
import cv2

def detect_video(image_path):
    print(f"Loading image from: {image_path}")
    
    model_path = 'C:/Users/ikram/OneDrive/Dokumen/GitHub/Konco_Ikram_DSC/Folder Website/models/best.pt'
    
    # Cek apakah model path valid
    import os
    if not os.path.exists(model_path):
        print(f"Model path tidak ditemukan: {model_path}")
        return

    try:
        print("Memuat model...")
        model = YOLO(model_path)  # Memuat model
        print("Model berhasil dimuat.")
    except Exception as e:
        print(f"Error loading model: {e}")
        return
    
    # Gambar dimuat
    print(f"Loading image from: {image_path}")
    frame = cv2.imread(image_path)
    if frame is None:
        print("Gambar tidak berhasil dimuat.")
        return

    print("Image successfully loaded")
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    print("Image converted to RGB")

    try:
        results = model.predict(source=image)  # Melakukan prediksi
        print("Prediksi berhasil dilakukan.")
        print("Hasil dari model:", results)  # Debugging output
    except Exception as e:
        print(f"Error during prediction: {e}")
        return

    detections = []
    conf_threshold = 0.2 
    for detection in results[0].boxes:
        x1, y1, x2, y2 = detection.xyxy[0].tolist()  
        conf = detection.conf[0].item()  # Mengambil confidence
        cls_id = detection.cls[0].item()  # Mengambil class ID
        
        print(f"Deteksi - ID: {cls_id}, Conf: {conf:.2f}")

        if conf > conf_threshold:
            detections.append(f"ID: {cls_id}, Conf: {conf:.2f}")

    if detections:
        print("\nHasil Deteksi:")
        print("\n".join(detections))
    else:
        print("Tidak ada deteksi yang memenuhi ambang batas.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        detect_video(image_path)
    else:
        print("Image path is required")
