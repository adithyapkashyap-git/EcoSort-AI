import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import '../styles/pages/result.css';

function Result() {
  const { latestResult, saveResult } = useAppContext();
  const [saveMessage, setSaveMessage] = useState('');

  if (!latestResult) {
    return (
      <MainLayout>
        <section className="page-shell result-screen page-enter">
          <Card className="result-screen__empty" tone="soft">
            <span className="card-label">No Scan Yet</span>
            <h1>Your latest waste result will appear here.</h1>
            <p>
              Start from the home screen, upload an item image, and EcoSort AI
              will build the disposal summary for you.
            </p>
            <Button to="/">Go to Home</Button>
          </Card>
        </section>
      </MainLayout>
    );
  }

  const handleSave = () => {
    const response = saveResult(latestResult);
    setSaveMessage(response.message);
  };

  return (
    <MainLayout>
      <section className="page-shell result-screen page-enter">
        <div className="result-screen__grid">
          <Card className="result-screen__preview" tone="soft">
            <span className="card-label">Image Preview</span>
            <img src={latestResult.imageUrl} alt={latestResult.detectedItem} />
          </Card>

          <Card className="result-screen__details">
            <div className="result-screen__header">
              <div>
                <span className="card-label">Detected Item</span>
                <h1>{latestResult.detectedItem}</h1>
              </div>
              <div className="result-screen__confidence">
                {(latestResult.confidence * 100).toFixed(0)}% match
              </div>
            </div>

            <div className="result-screen__meta">
              <span>{latestResult.category}</span>
              <span>{latestResult.badge}</span>
              <span>{latestResult.source}</span>
            </div>

            <div className="result-screen__section">
              <h2>Disposal Instructions</h2>
              <ul>
                {latestResult.disposalInstructions.map((instruction) => (
                  <li key={instruction}>{instruction}</li>
                ))}
              </ul>
            </div>

            <div className="result-screen__impact">
              <Card className="impact-card" tone="accent">
                <span className="card-label">Eco Impact</span>
                <h3>{latestResult.ecoImpactMessage}</h3>
                <div className="impact-card__stats">
                  <article>
                    <strong>{latestResult.impactStats.points}</strong>
                    <span>points</span>
                  </article>
                  <article>
                    <strong>{latestResult.impactStats.plasticSavedKg} kg</strong>
                    <span>plastic saved</span>
                  </article>
                  <article>
                    <strong>{latestResult.impactStats.co2ReducedKg} kg</strong>
                    <span>CO2 reduced</span>
                  </article>
                </div>
              </Card>
            </div>

            <div className="result-screen__actions">
              <Button to="/">Scan Again</Button>
              <Button variant="secondary" onClick={handleSave}>
                Save Result
              </Button>
            </div>

            {saveMessage ? <p className="result-screen__message">{saveMessage}</p> : null}

            <p className="result-screen__link">
              Want a drop-off point? <Link to="/centers">View nearby centers</Link>
            </p>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}

export default Result;
