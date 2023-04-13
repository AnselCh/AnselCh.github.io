---
title: "[Pytorch] Yolov5的一些筆記"
categories:
  - tutorial
date: 2023-02-18 09:15:38
tags: [Python,Pytorch,Yolo,Machine Learning,ML,AI,DL]
---

[Load YOLOv5 from PyTorch Hub ](https://github.com/ultralytics/yolov5/issues/36)

<!--more-->

__Detailed Example__

```
import cv2
import torch
from PIL import Image

# Model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# Custom Models
model = torch.hub.load('ultralytics/yolov5', 'custom', path='path/to/best.pt')  # local model
model = torch.hub.load('path/to/yolov5', 'custom', path='path/to/best.pt', source='local')  # local repo

# load on CPU
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', device='cpu')

# Images
for f in 'zidane.jpg', 'bus.jpg':
    torch.hub.download_url_to_file('https://ultralytics.com/images/' + f, f)  # download 2 images
im1 = Image.open('zidane.jpg')  # PIL image
im2 = cv2.imread('bus.jpg')[..., ::-1]  # OpenCV image (BGR to RGB)

# Inference
results = model([im1, im2], size=640) # batch of images

# Results
results.print()
results.save()  # or .show()

results.xyxy[0]  # im1 predictions (tensor)
results.pandas().xyxy[0]  # im1 predictions (pandas)
```

__Inference Settings__

```
model.conf = 0.25  # NMS confidence threshold
      iou = 0.45  # NMS IoU threshold
      agnostic = False  # NMS class-agnostic
      multi_label = False  # NMS multiple labels per box
      classes = None  # (optional list) filter by class, i.e. = [0, 15, 16] for COCO persons, cats and dogs
      max_det = 1000  # maximum number of detections per image
      amp = False  # Automatic Mixed Precision (AMP) inference

results = model(im, size=320)  # custom inference size
```

__Cropped Results__

```
results = model(img)
crops = results.crop(
    save=True, save_dir=r'path')
```

__Pandas Results__

```
results = model(im)  # inference
results.pandas().xyxy[0]  # Pandas DataFrame
```

__JSON Results__

```
results = model(ims)  # inference
results.pandas().xyxy[0].to_json(orient="records")  # JSON img1 predictions
```
__Training__

```
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', autoshape=False)  # load pretrained
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', autoshape=False, pretrained=False)  # load scratch
```

__TensorRT, ONNX and OpenVINO Models__

```
# ProTip: TensorRT may be up to 2-5X faster than PyTorch on GPU benchmarks
model = torch.hub.load('ultralytics/yolov5', 'custom', path='yolov5s.pt')  # PyTorch
                                                            'yolov5s.torchscript')  # TorchScript
                                                            'yolov5s.onnx')  # ONNX
                                                            'yolov5s_openvino_model/')  # OpenVINO
                                                            'yolov5s.engine')  # TensorRT
                                                            'yolov5s.mlmodel')  # CoreML (macOS-only)
                                                            'yolov5s.tflite')  # TFLite
                                                            'yolov5s_paddle_model/')  # PaddlePaddle

```


__training__

[Train Custom Data](https://github.com/ultralytics/yolov5/wiki/Train-Custom-Data)
[Colab](https://colab.research.google.com/github/ultralytics/yolov5/blob/master/tutorial.ipynb)

```
git clone https://github.com/ultralytics/yolov5  # clone
cd yolov5
pip install -r requirements.txt  # install
pip install clearml
# run clearml-init to connect to a ClearML server (deploy your own open-source server here, or use our free hosted server here)
```

__Export a Trained YOLOv5 Model__
[TFLite, ONNX, CoreML, TensorRT Export](https://github.com/ultralytics/yolov5/issues/251)

```
python export.py --weights yolov5s.pt --include torchscript onnx openvino
```

__訓練自己資料__
[train](https://officeguide.cc/pytorch-yolo-v5-object-egg-detection-models-tutorial-examples/)