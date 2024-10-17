document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const toggle = document.querySelector(".toggle");
    const cameraStatus = document.querySelector(".camera-status");
    let stream;
    let model;

    // Muat model TensorFlow.js
    const modelUrl = "/tensorflow-model/model.json"; // Pastikan path model sudah sesuai

    async function loadModel() {
        try {
            model = await tf.loadGraphModel(modelUrl);
            console.log("Model berhasil dimuat", model);
        } catch (error) {
            console.error("Error loading the model:", error);
        }
    }

    // Panggil fungsi untuk memuat model saat halaman dimuat
    loadModel().then(() => {
        toggle.classList.remove("active");
        video.srcObject = null;
        cameraStatus.style.display = "block";

        toggle.addEventListener("click", function () {
            this.classList.toggle("active");

            if (this.classList.contains("active")) {
                if (!stream) {
                    startCamera();
                } else {
                    video.srcObject = stream;
                    cameraStatus.style.display = "none";
                }
            } else {
                stopCamera();
            }
        });
    });

    function startCamera() {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function (mediaStream) {
                stream = mediaStream;
                video.srcObject = stream;
                cameraStatus.style.display = "none";

                video.addEventListener("loadeddata", () => {
                    if (video.videoWidth > 0 && video.videoHeight > 0) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        requestAnimationFrame(updateVideoFrame); // Mulai menampilkan video frame
                        captureFrame(); // Mulai menangkap frame untuk prediksi
                    } else {
                        console.warn("Video dimensions are still 0.");
                    }
                });
            })
            .catch(function (error) {
                console.error("Error accessing the camera: ", error);
            });
    }

    function stopCamera() {
        video.srcObject = null;
        cameraStatus.style.display = "block";
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            stream = null;
        }
    }

    function updateVideoFrame() {
        // Render video di canvas untuk memastikan tampilan tetap real-time
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Panggil lagi fungsi ini menggunakan requestAnimationFrame
        requestAnimationFrame(updateVideoFrame);
    }

    let frameCount = 0;
    function captureFrame() {
        if (video.srcObject) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Gambar video di canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Konversi frame dari canvas menjadi tensor
            let imageTensor = tf.browser
                .fromPixels(canvas)
                .expandDims(0)
                .toFloat();

            // Resize gambar ke ukuran yang diharapkan oleh model (640x640)
            imageTensor = tf.image.resizeBilinear(imageTensor, [640, 640]);

            // Prediksi menggunakan model
            model
                .execute({ images: imageTensor })
                .array()
                .then((predictions) => {
                    console.log(predictions); // Tambahkan ini untuk memeriksa output model
                    drawDetections(predictions); // Gambar deteksi
                });
        }

        // Panggil lagi fungsi ini menggunakan requestAnimationFrame untuk real-time capture
        requestAnimationFrame(captureFrame);
    }

    // Fungsi untuk menggambar deteksi
    function drawDetections(predictions) {
        console.log("Predictions (Raw Output): ", predictions); // Tampilkan nilai prediksi

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas sebelum menggambar ulang

        // Gambar ulang video di canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Loop melalui setiap prediksi
        predictions[0].forEach((detection) => {
            const [x, y, width, height, confidence] = detection.slice(0, 5); // Ambil bounding box dan confidence

            // Validasi nilai koordinat
            if (confidence > 0.7) {
                // Gambar hanya jika confidence di atas threshold
                const xScaled = x * canvas.width; // Sesuaikan dengan ukuran canvas
                const yScaled = y * canvas.height;
                const widthScaled = width * canvas.width;
                const heightScaled = height * canvas.height;

                // Validasi untuk memastikan bounding box berada di dalam canvas
                if (
                    xScaled < canvas.width &&
                    yScaled < canvas.height &&
                    xScaled + widthScaled > 0 &&
                    yScaled + heightScaled > 0
                ) {
                    // Gambar bounding box
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(xScaled, yScaled, widthScaled, heightScaled);

                    // Gambar label dan confidence
                    ctx.fillStyle = "red";
                    ctx.font = "16px Arial";
                    ctx.fillText(
                        `Confidence: ${(confidence * 100).toFixed(2)}%`,
                        xScaled,
                        yScaled > 10 ? yScaled - 5 : 10
                    );
                }
            }
        });
    }
});
