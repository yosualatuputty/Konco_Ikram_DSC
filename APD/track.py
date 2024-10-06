from ultralytics import YOLO

# Load a model
model = YOLO("mask.pt")  # build a new model from scratch

# Use the model
# model.train(data="config.yaml", epochs=100)  # train the model

model.track(source=0,  show=True, tracker="bytetrack.yaml")