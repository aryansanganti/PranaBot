import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, Loader2, Leaf, BookOpen, X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Navbar from './Navbar';
import Footer from './Footer';
import HowToUse from './HowToUse';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyARExVrQ7BF8JNuCZumTHN3El_n8L0z33w");

const AyurvedicPlantIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Check for camera permissions when component mounts
  useEffect(() => {
    checkCameraPermissions();
    return () => {
      stopCameraStream();
    };
  }, []);

  // Check if camera permissions are granted
  const checkCameraPermissions = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      setCameraPermission(result.state === 'granted');
    } catch (error) {
      console.log('Camera permissions API not supported');
    }
  };

  // Start camera stream
  const startCameraStream = async () => {
    try {
      // First stop any existing streams
      stopCameraStream();

      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure camera permissions are granted.');
      setIsCameraActive(false);
    }
  };

  // Stop camera stream
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Handle camera button click
  const handleCameraClick = async () => {
    if (isCameraActive) {
      // If camera is active, capture photo
      capturePhoto();
    } else {
      // If camera is inactive, start camera
      await startCameraStream();
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        handleImageFile(file);
        stopCameraStream();
      }, 'image/jpeg', 0.95);

    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo. Please try again.');
    }
  };

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  // Process image file
  const handleImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    setSelectedImage(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    identifyPlant(file);
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Convert file to Gemini-compatible format
  const fileToGenerativePart = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Identify plant using Gemini AI
  const identifyPlant = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const imagePart = await fileToGenerativePart(file);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analyze this plant image and provide the following information in JSON format:
      1. Common name
      2. Scientific name
      3. Medicinal properties in Ayurveda (list at least 3)
      4. Common therapeutic uses (list at least 3)
      5. Traditional preparation methods

      Format the response as:
      {
        "commonName": "...",
        "scientificName": "...",
        "properties": ["...", "...", "..."],
        "uses": ["...", "...", "..."],
        "preparation": "..."
      }`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      const plantData = JSON.parse(text);
      setResult({
        name: plantData.commonName,
        scientificName: plantData.scientificName,
        properties: plantData.properties,
        uses: plantData.uses,
        preparation: plantData.preparation
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to analyze the image. Please try again.');
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
            Ayurvedic Plant Identifier
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload/Camera Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  {isCameraActive ? 'Camera Preview' : 'Upload Plant Image'}
                </h2>
              </div>
              <div className="p-4">
                <div className="flex flex-col items-center gap-4">
                  {/* Camera/Preview Area */}
                  <div className="w-full h-64 relative">
                    {isCameraActive ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={stopCameraStream}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div
                        className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Click, drag image, or drop here
                        </p>
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                          id="fileInput"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 w-full justify-center">
                    {!isCameraActive && (
                      <label
                        htmlFor="fileInput"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </label>
                    )}
                    <button
                      onClick={handleCameraClick}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      {isCameraActive ? 'Capture Photo' : 'Open Camera'}
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="text-red-500 text-sm text-center">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Plant Information
                </h2>
              </div>
              <div className="p-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    <p className="text-gray-500">Analyzing image with Gemini AI...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-64 text-red-500">
                    <p className="text-center">{error}</p>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{result.name}</h3>
                      <p className="text-sm text-gray-500 italic">
                        {result.scientificName}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Medicinal Properties:</h4>
                      <ul className="list-disc list-inside text-sm">
                        {result.properties.map((prop, idx) => (
                          <li key={idx}>{prop}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Common Uses:</h4>
                      <ul className="list-disc list-inside text-sm">
                        {result.uses.map((use, idx) => (
                          <li key={idx}>{use}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <h4 className="font-medium text-blue-700">Preparation</h4>
                      </div>
                      <p className="text-sm text-blue-600">{result.preparation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Leaf className="w-8 h-8 mb-2" />
                    <p>Upload an image to identify the plant</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <HowToUse />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AyurvedicPlantIdentifier;