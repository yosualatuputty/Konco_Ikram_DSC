from ultralytics import YOLO
import torch

# buat training model 
# # Load a model
# model = YOLO("yolov8l.pt")  # build a new model from scratch

# # Use the model
# model.train(data="C:\\Users\\Lenovo\\deteksi-motor\\dataset\\data.yaml", epochs=20)  # train the model

# # # model.track(source="2024-06-07 11-34-16.mkv",  show=True, tracker="bytetrack.yaml")


def main():
    # Your model training code here
    torch.cuda.empty_cache()
    model = YOLO("yolov8l.pt")  # Adjust this line according to your model initialization
    model.train(data="C:\\Users\\Lenovo\\deteksi-motor\\dataset\\data.yaml", imgsz=640 ,epochs=100, batch=4, device=0, workers=6, amp=False, lr0=0.001)  # Train the model



if __name__ == "__main__":
    main()