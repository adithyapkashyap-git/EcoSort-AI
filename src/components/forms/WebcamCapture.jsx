import Button from '../ui/Button';
import Card from '../ui/Card';
import '../../styles/components/webcam.css';

function WebcamCapture({
  errorMessage,
  isOpen,
  isStarting,
  onCapture,
  onClose,
  onStart,
  videoRef,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Card className="webcam-card" tone="soft">
      <div className="webcam-card__header">
        <div>
          <span className="card-label">Webcam Capture</span>
          <h2>Scan waste using your camera</h2>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <p className="webcam-card__text">
        Allow camera access, frame the waste item clearly, then capture an image
        for identification.
      </p>

      <div className="webcam-card__viewport">
        <video
          ref={videoRef}
          autoPlay
          className="webcam-card__video"
          muted
          playsInline
        />
        {!isStarting ? null : (
          <div className="webcam-card__overlay">Starting camera...</div>
        )}
      </div>

      {errorMessage ? (
        <p className="webcam-card__error">{errorMessage}</p>
      ) : null}

      <div className="webcam-card__actions">
        <Button disabled={isStarting} onClick={onStart} variant="secondary">
          {isStarting ? 'Opening Camera...' : 'Start Camera'}
        </Button>
        <Button disabled={isStarting} onClick={onCapture}>
          Capture Photo
        </Button>
      </div>
    </Card>
  );
}

export default WebcamCapture;
