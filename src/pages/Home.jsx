import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDropzone from '../components/forms/ImageDropzone';
import WebcamCapture from '../components/forms/WebcamCapture';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import {
  classifyWasteImage,
  warmUpClassification,
} from '../services/classificationService';
import '../styles/pages/home.css';
import { fileToDataUrl } from '../utils/file';

const sortingTips = [
  'Rinse bottles quickly before recycling to avoid contamination.',
  'Soft plastics need separate collection in many cities.',
  'Keep batteries out of general waste to reduce fire risk.',
  'Flatten cardboard before dropping it into paper recycling.',
];

function Home() {
  const navigate = useNavigate();
  const { metrics, registerScan } = useAppContext();
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState(
    'Loading vision models for more accurate identification...'
  );
  const [isScanning, setIsScanning] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [isWebcamStarting, setIsWebcamStarting] = useState(false);
  const [webcamError, setWebcamError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const tipOfTheDay = sortingTips[new Date().getDate() % sortingTips.length];

  const stopWebcamStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const prepareModels = async () => {
      await warmUpClassification();

      if (isMounted) {
        setStatusMessage('Vision models are ready. Upload a waste photo to begin.');
      }
    };

    prepareModels().catch(() => {
      if (isMounted) {
        setStatusMessage(
          'Browser vision could not warm up, but you can still upload and scan an image.'
        );
      }
    });

    return () => {
      isMounted = false;
      stopWebcamStream();
    };
  }, [stopWebcamStream]);

  const applySelectedFile = async (file, providedPreviewUrl) => {
    setSelectedFile(file);
    setStatusMessage(`${file.name} is ready for AI identification.`);

    try {
      const imageUrl = providedPreviewUrl || (await fileToDataUrl(file));
      setPreviewUrl(imageUrl);
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleSelectFile = async (file) => {
    await applySelectedFile(file);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      await handleSelectFile(droppedFile);
    }
  };

  const handleIdentifyWaste = async () => {
    if (!selectedFile) {
      setStatusMessage('Choose an image before running identification.');
      return;
    }

    setIsScanning(true);
    setStatusMessage('EcoSort AI is identifying the waste item...');

    try {
      const imageUrl = previewUrl || (await fileToDataUrl(selectedFile));
      const result = await classifyWasteImage(selectedFile, imageUrl);

      registerScan(result);
      setStatusMessage('Classification complete. Opening your result screen.');
      navigate('/result');
    } catch (error) {
      setStatusMessage(
        error.message || 'Something went wrong while identifying the image.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const startWebcam = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const message = 'This browser does not support webcam access.';
      setWebcamError(message);
      setStatusMessage(message);
      return;
    }

    if (streamRef.current && videoRef.current?.srcObject) {
      return;
    }

    setIsWebcamStarting(true);
    setWebcamError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatusMessage('Camera is live. Capture a waste photo when ready.');
    } catch (error) {
      const message =
        error?.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow access and try again.'
          : 'Unable to access the webcam right now.';

      setWebcamError(message);
      setStatusMessage(message);
    } finally {
      setIsWebcamStarting(false);
    }
  }, []);

  const handleWebcamClick = async () => {
    setIsWebcamOpen(true);
    await startWebcam();
  };

  const handleCloseWebcam = () => {
    stopWebcamStream();
    setIsWebcamOpen(false);
    setWebcamError('');
    setStatusMessage('Webcam closed. You can reopen it or upload an image.');
  };

  const handleCaptureFromWebcam = async () => {
    const videoElement = videoRef.current;

    if (!videoElement || !videoElement.videoWidth || !videoElement.videoHeight) {
      const message = 'The webcam is not ready yet. Start the camera and try again.';
      setWebcamError(message);
      setStatusMessage(message);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');

    if (!context) {
      const message = 'Unable to capture a frame from the webcam.';
      setWebcamError(message);
      setStatusMessage(message);
      return;
    }

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const capturedPreviewUrl = canvas.toDataURL('image/jpeg', 0.92);

    const capturedBlob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.92);
    });

    if (!capturedBlob) {
      const message = 'The camera frame could not be converted into an image.';
      setWebcamError(message);
      setStatusMessage(message);
      return;
    }

    const capturedFile = new File([capturedBlob], `webcam-capture-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });

    await applySelectedFile(capturedFile, capturedPreviewUrl);
    stopWebcamStream();
    setIsWebcamOpen(false);
    setWebcamError('');
    setStatusMessage('Webcam photo captured successfully. Ready for identification.');
  };

  return (
    <MainLayout>
      <section className="page-shell home-screen page-enter">
        <div className="home-screen__hero">
          <div className="home-screen__copy">
            <span className="eyebrow">Smart Waste Recognition</span>
            <h1>Identify waste in seconds and turn daily disposal into impact.</h1>
            <p>
              Upload a photo, preview the item, and let EcoSort AI suggest the
              right disposal route, nearby drop points, and measurable climate
              gains.
            </p>

            <div className="home-screen__actions">
              <Button disabled={isScanning} onClick={handleIdentifyWaste}>
                {isScanning ? 'Identifying...' : 'Identify Waste'}
              </Button>
              <Button
                disabled={isWebcamStarting}
                variant="secondary"
                onClick={handleWebcamClick}
              >
                {isWebcamOpen ? 'Camera Active' : 'Open Webcam'}
              </Button>
            </div>

            <div className="home-screen__metrics">
              <Card className="stat-card">
                <strong>{metrics.scansCompleted}</strong>
                <span>total scans</span>
              </Card>
              <Card className="stat-card">
                <strong>{metrics.savedResultsCount}</strong>
                <span>results saved</span>
              </Card>
              <Card className="stat-card">
                <strong>{metrics.totalPoints}</strong>
                <span>eco points</span>
              </Card>
            </div>
          </div>

          <ImageDropzone
            dragging={dragging}
            fileName={selectedFile?.name}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onSelectFile={handleSelectFile}
            previewUrl={previewUrl}
          />
        </div>

        <WebcamCapture
          errorMessage={webcamError}
          isOpen={isWebcamOpen}
          isStarting={isWebcamStarting}
          onCapture={handleCaptureFromWebcam}
          onClose={handleCloseWebcam}
          onStart={startWebcam}
          videoRef={videoRef}
        />

        <div className="home-screen__grid">
          <Card className="tip-card" tone="accent">
            <span className="card-label">Tip of the Day</span>
            <h2>{tipOfTheDay}</h2>
            <p>
              Cleaner material streams mean better recovery rates and fewer
              rejected recycling loads.
            </p>
          </Card>

          <Card className="status-card">
            <span className="card-label">Session Status</span>
            <h2>Ready for Your Next Scan</h2>
            <p>{statusMessage}</p>
          </Card>

          <Card className="status-card">
            <span className="card-label">Why It Helps</span>
            <h2>Reduce sorting mistakes</h2>
            <p>
              Better disposal guidance lowers contamination, protects recovery
              equipment, and boosts circular material reuse.
            </p>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}

export default Home;
