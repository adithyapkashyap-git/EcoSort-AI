import { useRef } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import '../../styles/components/dropzone.css';

function ImageDropzone({
  dragging,
  fileName,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onSelectFile,
  previewUrl,
}) {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onSelectFile(selectedFile);
    }
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  return (
    <Card
      className={`dropzone ${dragging ? 'dropzone--dragging' : ''}`}
      tone="soft"
    >
      <input
        ref={inputRef}
        className="dropzone__input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <div
        className="dropzone__surface"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        role="presentation"
      >
        <span className="dropzone__eyebrow">Upload Image</span>
        <h3>Drag and drop a waste photo here</h3>
        <p>
          Upload an item image and EcoSort AI will detect the material category
          and suggest the next disposal step.
        </p>

        {previewUrl ? (
          <div className="dropzone__preview">
            <img src={previewUrl} alt="Waste preview" />
          </div>
        ) : (
          <div className="dropzone__placeholder">
            <span>PNG, JPG, or WEBP</span>
            <strong>Ready for drop</strong>
          </div>
        )}

        <div className="dropzone__actions">
          <Button onClick={openPicker}>Choose Image</Button>
          <span>{fileName || 'No file selected yet'}</span>
        </div>
      </div>
    </Card>
  );
}

export default ImageDropzone;
