---
title: "[PyQt5] 做一個GUI介面的時鐘吧!"
categories:
  - repository
date: 2023-03-06 11:06:13
tags: [Python,PyQt5]
---
<meta name="referrer" content="no-referrer" />

<img src="./max.jpg" alt="max" style="display:block; margin:auto;"/>

專案地址:https://github.com/AnselCh/widget_clock

# 目標
做出一個可以自訂位子且能調整透明度的小時鐘。

<!--more-->

# 正文

```
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
from time import strftime
import sys
import threading
```

載入GUI套件跟多執行緒，因為不能因調整透明度導致時間暫停更新，所以採用多執行緒。

```
class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Ann Clock')
        self.setWindowFlags(Qt.WindowStaysOnTopHint)  # 視窗置頂
        self.setWindowFlag(Qt.FramelessWindowHint)  # 標題列消失
        self.setAttribute(Qt.WA_TranslucentBackground)  # 整個label以外設為半透明
        self.resize(360, 110)
        self.setUpdatesEnabled(True)  # 時間更新的Thread
        self.ui()
        self.clock_window = True
```
主視窗建置跟設定

```
def ui(self):

        self.label_time = QLabel(self)
        font = QFont()
        font.setFamily('calibri')
        font.setPointSize(40)
        font.setBold(True)
        self.label = QLabel(self)
        self.label.setGeometry(140, 90, 100, 30)
        self.label_time.setFont(font)
        self.label_time.setAlignment(Qt.AlignCenter)
        radius = 12
        self.label_time.setStyleSheet('''
            color:	black;
            background:rgb(245, 245, 245);
            border-top-left-radius:{0}px;
            border-bottom-left-radius:{0}px;
            border-top-right-radius:{0}px;
            border-bottom-right-radius:{0}px;
            '''.format(radius))
        self.slider = QSlider(self)
        self.slider.setGeometry(30, 75, 300, 30)
        self.slider.setRange(1, 10)
        self.slider.setValue(5)
        self.slider.setOrientation(1)
        self.slider.setStyleSheet('''
        QSlider {   border-radius: 10px;    }
        QSlider::groove:horizontal {
            height: 5px;
            background: #C2C287;
        }
        QSlider::handle:horizontal{
            background: #FFFFAA;
            width: 16px;
            height: 16px;
            margin:-6px 0;
            border-radius:8px;
        }
        QSlider::sub-page:horizontal{
            background:#A5A552;
        }
        ''')
```
setStyleSheet設定四個角的平滑度跟label顏色
並加上slider(滑桿)調整透明度

```
def nowtime(self):
        while self.clock_window:
            string = strftime('%H:%M:%S %p')
            self.label_time.setText(string)
```

這邊是刷新時間的while迴圈，等等會用一個執行緒調用

```
def transparency(self):
        while self.clock_window:
            user_setting = ((self.slider.value())/10)
            tran = user_setting
            self.setWindowOpacity(tran)

```

這邊是讀取slider調整數值while迴圈，等等會用另一個執行緒調用，來實現一邊調整透明度又不影響時間更新。

```
def closeEvent(self, event):
        self.clock_window = False

def mousePressEvent(self, event):
    self.oldPosition = event.globalPos()

def mouseMoveEvent(self, event):
    delta = QPoint(event.globalPos() - self.oldPosition)
    self.move(self.x() + delta.x(), self.y() + delta.y())
    self.oldPosition = event.globalPos()

```
closeEvent是結束視窗函數，下面兩段則是讓視窗能夠點及任何位子就能拉到自訂位子，不過在ubuntu上執行位子會有點怪怪的，不確定是不是我個人問題?

```
if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MyWidget()
    clock = threading.Thread(target=window.nowtime)
    se = threading.Thread(target=window.transparency)
    clock.start()
    se.start()
    window.show()
    sys.exit(app.exec_())
```
最後是啟動GUI的函式。

