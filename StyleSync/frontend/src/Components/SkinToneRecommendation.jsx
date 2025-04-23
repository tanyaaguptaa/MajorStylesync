import React, { useRef, useState, useEffect } from "react";

// Base URL for the backend
const API_BASE_URL = "http://localhost:8000";

export default function SkinToneRecommendation() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraImage, setCameraImage] = useState("");
  const [complexion, setComplexion] = useState(null);
  const [recommendedImages, setRecommendedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Access the user's webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setError("Failed to access camera. Please check your permissions.");
      });
  }, []);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    setCameraImage(dataURL);
  };

  const handleCameraSubmit = async (e) => {
    e.preventDefault();
    if (!cameraImage) {
      alert("Capture an image first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("camera_image", cameraImage);

    try {
      const res = await fetch(`${API_BASE_URL}/camera`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data = await res.json();
      setComplexion(data.complexion);
      setRecommendedImages(data.images);
    } catch (err) {
      console.error("Error while submitting captured image:", err);
      setError("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fileInput = e.target.elements.image;

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data = await res.json();
      setComplexion(data.complexion);
      setRecommendedImages(data.images);
    } catch (err) {
      console.error("Error while uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Skin Tone Analyzer</h1>
      <p>
        Upload your photo or use your camera to get clothing recommendations
        based on your skin tone
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Upload Form */}
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Upload Image</h2>
          <form onSubmit={handleUploadSubmit}>
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              style={{ marginBottom: "10px" }}
            />
            <div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Processing..." : "Upload Image"}
              </button>
            </div>
          </form>
        </div>

        {/* Camera Section */}
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Use Camera</h2>
          <div>
            <video
              ref={videoRef}
              width="300"
              height="225"
              autoPlay
              style={{ background: "#000", marginBottom: "10px" }}
            />
            <canvas
              ref={canvasRef}
              width="300"
              height="225"
              style={{ display: "none" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <button
              onClick={handleCapture}
              style={{ padding: "8px 16px", marginRight: "10px" }}
            >
              Capture
            </button>
          </div>
          {cameraImage && (
            <div style={{ marginBottom: "10px" }}>
              <img
                src={cameraImage}
                alt="Captured"
                style={{ width: "150px", border: "1px solid #ddd" }}
              />
              <form onSubmit={handleCameraSubmit}>
                <input type="hidden" name="camera_image" value={cameraImage} />
                <div style={{ marginTop: "10px" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "8px 16px",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Processing..." : "Analyze Captured Image"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && <div style={{ color: "red", margin: "20px 0" }}>{error}</div>}

      {/* Display Results */}
      {complexion && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Results</h2>
          <p>
            <strong>Your skin tone is:</strong> {complexion}
          </p>
          <h3>Recommended clothes:</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {recommendedImages.map((img, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}${img}`}
                width="150"
                height="200"
                alt="Recommended"
                style={{ objectFit: "cover", border: "1px solid #ddd" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
