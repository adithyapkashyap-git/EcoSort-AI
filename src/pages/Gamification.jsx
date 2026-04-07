import MainLayout from '../components/layout/MainLayout';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import { achievements, leaderboard } from '../data/gamification';
import '../styles/pages/gamification.css';

function isUnlocked(achievement, metrics) {
  if (achievement.type === 'scan') {
    return metrics.scansCompleted >= achievement.threshold;
  }

  if (achievement.type === 'saved') {
    return metrics.savedResultsCount >= achievement.threshold;
  }

  if (achievement.type === 'plastic') {
    return metrics.plasticSavedKg >= achievement.threshold;
  }

  if (achievement.type === 'co2') {
    return metrics.co2ReducedKg >= achievement.threshold;
  }

  return metrics.totalPoints >= achievement.threshold;
}

function Gamification() {
  const { metrics } = useAppContext();
  const nextMilestone =
    achievements.find((achievement) => !isUnlocked(achievement, metrics)) ||
    achievements[achievements.length - 1];

  return (
    <MainLayout>
      <section className="page-shell rewards-screen page-enter">
        <div className="page-heading">
          <span className="eyebrow">Gamification</span>
          <h1>Reward progress, consistency, and cleaner sorting habits.</h1>
          <p>
            EcoSort AI turns everyday disposal into a simple point system with
            badges, achievements, and a friendly leaderboard.
          </p>
        </div>

        <div className="rewards-screen__hero">
          <Card className="points-card" tone="accent">
            <span className="card-label">Points System</span>
            <strong>{metrics.totalPoints}</strong>
            <p>
              Next milestone: {nextMilestone.name} at {nextMilestone.threshold}{' '}
              {nextMilestone.type === 'points' ? 'points' : 'progress'}.
            </p>
          </Card>

          <Card className="leaderboard-card">
            <span className="card-label">Leaderboard</span>
            <div className="leaderboard-list">
              {leaderboard.map((entry) => (
                <article key={entry.name} className="leaderboard-list__item">
                  <strong>{entry.name}</strong>
                  <span>
                    {entry.name === 'You' ? metrics.totalPoints : entry.points} pts
                  </span>
                </article>
              ))}
            </div>
          </Card>
        </div>

        <div className="achievements-grid">
          {achievements.map((achievement) => {
            const unlocked = isUnlocked(achievement, metrics);

            return (
              <Card
                key={achievement.id}
                className={`achievement-card ${
                  unlocked ? 'achievement-card--active' : ''
                }`}
              >
                <div className="achievement-card__badge">{achievement.badge}</div>
                <span className="card-label">
                  {unlocked ? 'Unlocked' : 'Locked'}
                </span>
                <h2>{achievement.name}</h2>
                <p>{achievement.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </MainLayout>
  );
}

export default Gamification;
