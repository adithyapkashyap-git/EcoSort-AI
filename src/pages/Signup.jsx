import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import '../styles/pages/auth.css';

function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAppContext();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback('');

    const response = await signUp(formData);
    setFeedback(response.message);

    if (response.success) {
      navigate('/', { replace: true });
    }

    setIsSubmitting(false);
  };

  return (
    <section className="auth-screen page-enter">
      <div className="auth-screen__panel">
        <div className="auth-screen__hero">
          <span className="eyebrow">Create Account</span>
          <h1>Set up your EcoSort AI profile in a minute.</h1>
          <p>
            Create a local account on this device so your scans, rewards, and
            dashboard stats stay tied to your login.
          </p>
        </div>

        <Card className="auth-card">
          <span className="card-label">Sign Up</span>
          <h2>Create your account</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Full name</span>
              <input
                required
                autoComplete="name"
                name="fullName"
                onChange={handleChange}
                placeholder="Adithya Kashyap"
                type="text"
                value={formData.fullName}
              />
            </label>

            <label className="auth-field">
              <span>Email</span>
              <input
                required
                autoComplete="email"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                type="email"
                value={formData.email}
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                required
                autoComplete="new-password"
                minLength={6}
                name="password"
                onChange={handleChange}
                placeholder="Create a password"
                type="password"
                value={formData.password}
              />
            </label>

            <Button disabled={isSubmitting} fullWidth type="submit">
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          {feedback ? <p className="auth-feedback">{feedback}</p> : null}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </Card>
      </div>
    </section>
  );
}

export default Signup;
