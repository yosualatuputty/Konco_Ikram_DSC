const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const toggleButton = document.getElementById("toggle-camera");

let streaming = false; 
let intervalId; 
let mediaStream; 

function startCamera() {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            mediaStream = stream;
            video.srcObject = stream;
            streaming = true;

            video.addEventListener("loadedmetadata", () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });

            intervalId = setInterval(() => {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                processFrame(); // Panggil processFrame tanpa argumen, kita ambil langsung dari canvas
            }, 100);
            toggleButton.textContent = "Stop Camera"; 
        })
        .catch((err) => {
            console.error("Error accessing camera: " + err);
        });
}

function stopCamera() {
    clearInterval(intervalId); 
    if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
    }
    video.srcObject = null; 
    streaming = false;
    toggleButton.textContent = "Start Camera"; 
}

toggleButton.addEventListener("click", () => {
    if (streaming) {
        stopCamera();
    } else {
        startCamera();
    }
});

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

function processFrame() {
    const imageData = canvas.toDataURL("image/png"); // Ambil data URI dari canvas
    if (!imageData) {
        console.error("Data URI tidak valid.");
        return;
    }
    
    fetch("/detect-video", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({ video: imageData }), // Kirim data URI ke server
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        if (data.result) {
            console.log("Deteksi:", data.result);
            drawResults(imageData, data.result); // Panggil drawResults dengan data hasil deteksi
        } else {
            console.log("Tidak ada hasil deteksi.");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function drawResults(imageSrc, detections) {
    // Mengatur ukuran canvas sama dengan video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Menggambar gambar ke canvas
    const img = new Image();
    img.src = imageSrc;
    img.onload = function() {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Menggambar bounding box dan label
        detections.forEach(detection => {
            const [x1, y1, x2, y2] = detection.box; // Ambil koordinat bounding box
            const label = `${detection.name}: ${detection.conf.toFixed(2)}`; // Label dengan confidence

            // Menggambar bounding box
            context.strokeStyle = 'green';
            context.lineWidth = 2;
            context.strokeRect(x1, y1, x2 - x1, y2 - y1);

            // Menggambar label
            context.font = '16px Arial';  // Mengatur font
            context.fillStyle = 'green';
            context.fillText(label, x1, y1 > 20 ? y1 - 10 : y1 + 10); // Menempatkan teks di atas bounding box
        });
    };

    // Menampilkan hasil di div results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Bersihkan sebelumnya
    resultsDiv.appendChild(canvas); // Tambahkan canvas dengan bounding box ke div results
}
