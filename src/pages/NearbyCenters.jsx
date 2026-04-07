import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import { nearbyCenters } from '../data/centers';
import '../styles/pages/centers.css';

function buildMapLink(center) {
  return `https://www.openstreetmap.org/?mlat=${center.latitude}&mlon=${center.longitude}#map=16/${center.latitude}/${center.longitude}`;
}

function buildMapEmbed(center) {
  const offset = 0.01;
  const left = center.longitude - offset;
  const right = center.longitude + offset;
  const top = center.latitude + offset;
  const bottom = center.latitude - offset;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${center.latitude}%2C${center.longitude}`;
}

function NearbyCenters() {
  const { latestResult } = useAppContext();
  const [selectedCenter, setSelectedCenter] = useState(nearbyCenters[0]);

  return (
    <MainLayout>
      <section className="page-shell centers-screen page-enter">
        <div className="page-heading">
          <span className="eyebrow">Nearby Centers</span>
          <h1>Drop-off locations for better disposal decisions.</h1>
          <p>
            {latestResult
              ? `Recommended follow-up for ${latestResult.detectedItem}: ${latestResult.category}.`
              : 'Browse demo centers and preview their location on the map.'}
          </p>
        </div>

        <div className="centers-screen__grid">
          <div className="centers-screen__list">
            {nearbyCenters.map((center) => (
              <Card
                key={center.id}
                className={`center-card ${
                  selectedCenter.id === center.id ? 'center-card--active' : ''
                }`}
              >
                <div>
                  <span className="card-label">{center.distance}</span>
                  <h2>{center.name}</h2>
                  <p>{center.accepts}</p>
                </div>
                <div className="center-card__actions">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedCenter(center)}
                  >
                    View on Map
                  </Button>
                  <Button
                    href={buildMapLink(center)}
                    rel="noreferrer"
                    target="_blank"
                    variant="ghost"
                  >
                    Open Map
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="map-card">
            <span className="card-label">Map Preview</span>
            <h2>{selectedCenter.name}</h2>
            <iframe
              className="map-card__frame"
              src={buildMapEmbed(selectedCenter)}
              title={selectedCenter.name}
              loading="lazy"
            />
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}

export default NearbyCenters;
