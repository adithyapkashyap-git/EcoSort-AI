import MainLayout from '../components/layout/MainLayout';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import '../styles/pages/dashboard.css';

function Dashboard() {
  const { latestResult, metrics, savedResults } = useAppContext();

  return (
    <MainLayout>
      <section className="page-shell dashboard-screen page-enter">
        <div className="page-heading">
          <span className="eyebrow">Impact Dashboard</span>
          <h1>Track your personal sorting momentum.</h1>
          <p>
            These metrics are stored locally, so your EcoSort demo dashboard
            grows as you scan and save items.
          </p>
        </div>

        <div className="dashboard-screen__stats">
          <Card className="dashboard-stat">
            <strong>{metrics.scansCompleted}</strong>
            <span>Total scans</span>
          </Card>
          <Card className="dashboard-stat">
            <strong>{metrics.savedResultsCount}</strong>
            <span>Saved results</span>
          </Card>
          <Card className="dashboard-stat">
            <strong>{metrics.plasticSavedKg} kg</strong>
            <span>Plastic saved</span>
          </Card>
          <Card className="dashboard-stat">
            <strong>{metrics.co2ReducedKg} kg</strong>
            <span>CO2 reduced</span>
          </Card>
        </div>

        <div className="dashboard-screen__grid">
          <Card className="dashboard-panel" tone="accent">
            <span className="card-label">Recent Highlight</span>
            <h2>{latestResult ? latestResult.detectedItem : 'No recent scan yet'}</h2>
            <p>
              {latestResult
                ? latestResult.ecoImpactMessage
                : 'Upload an item on the home screen to generate your first result summary.'}
            </p>
          </Card>

          <Card className="dashboard-panel">
            <span className="card-label">Saved Activity</span>
            {savedResults.length ? (
              <div className="dashboard-list">
                {savedResults.map((result) => (
                  <article key={result.id} className="dashboard-list__item">
                    <strong>{result.detectedItem}</strong>
                    <span>{result.category}</span>
                  </article>
                ))}
              </div>
            ) : (
              <p>No results saved yet. Save a result from the result screen to populate this list.</p>
            )}
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}

export default Dashboard;
