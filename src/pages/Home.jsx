import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDropzone from '../components/forms/ImageDropzone';
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

  const tipOfTheDay = sortingTips[new Date().getDate() % sortingTips.length];

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
    };
  }, []);

  const handleSelectFile = async (file) => {
    setSelectedFile(file);
    setStatusMessage(`${file.name} is ready for AI identification.`);

    try {
      const imageUrl = await fileToDataUrl(file);
      setPreviewUrl(imageUrl);
    } catch (error) {
      setStatusMessage(error.message);
    }
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

  const handleWebcamClick = () => {
    setStatusMessage('Webcam capture UI is prepared for a future live-camera step.');
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
              <Button variant="secondary" onClick={handleWebcamClick}>
                Open Webcam
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
