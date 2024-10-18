console.log("Medical JS loaded");

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas'); // Tambahkan elemen canvas di HTML
    const ctx = canvas.getContext('2d'); // Inisialisasi konteks canvas
    const toggle = document.querySelector('.toggle'); 
    const cameraStatus = document.querySelector('.camera-status'); 
    let stream; 

    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                stream = mediaStream; 
                video.srcObject = stream; 
                cameraStatus.style.display = 'none'; 
                captureFrame(); 
            })
            .catch(function(error) {
                console.error("Error accessing the camera: ", error);
            });
    }

    toggle.classList.remove('active'); 
    video.srcObject = null; 
    cameraStatus.style.display = 'block'; 

    toggle.addEventListener('click', function() {
        this.classList.toggle('active'); 

        if (this.classList.contains('active')) {
            if (!stream) {
                startCamera(); 
            } else {
                video.srcObject = stream; 
                cameraStatus.style.display = 'none'; 
            }
        } else {
            video.srcObject = null; 
            cameraStatus.style.display = 'block'; 
            if (stream) {
                stream.getTracks().forEach(track => {
                    track.stop(); 
                });
                stream = null; 
            }
        }
    });

    function captureFrame() {
        if (video.srcObject) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function(blob) {
                sendFrame(blob); 
            }, 'image/jpeg');
        }
        
        setTimeout(captureFrame, 500); 
    }

    function sendFrame(blob) {
        const formData = new FormData();
        formData.append('image', blob);

        fetch('http://127.0.0.1:5000/detect', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            drawDetections(data); 
        })
        .catch(error => {
            console.error('Error sending frame to Flask API: ', error);
        });
    }

    function drawDetections(detections) {
        console.log("Detections1: ", detections[0]); 
        console.log("Detections2: ", detections[1]); 
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        detections[0].forEach(detection => {
            const { label, confidence, bbox } = detection; 
            const [x, y, width, height] = bbox;
    
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
    
            ctx.fillStyle = 'red'; 
            ctx.font = '16px Arial';
            ctx.fillText(`${label} (${(confidence * 100).toFixed(2)}%)`, x, y > 10 ? y - 5 : 10);
        });

        detections[1].forEach(detection => {
            const { label, confidence, bbox } = detection; 
            const [x, y, width, height] = bbox;
    
            ctx.strokeStyle = 'blue'; 
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
    
            ctx.fillStyle = 'blue'; 
            ctx.font = '16px Arial';
            ctx.fillText(`${label} (${(confidence * 100).toFixed(2)}%)`, x, y > 10 ? y - 5 : 10);
        });
    }
});
