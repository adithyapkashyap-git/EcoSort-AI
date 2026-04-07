import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import '../styles/pages/auth.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = location.state?.from?.pathname || '/';

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

    const response = await login(formData);
    setFeedback(response.message);

    if (response.success) {
      navigate(fromPath, { replace: true });
    }

    setIsSubmitting(false);
  };

  return (
    <section className="auth-screen page-enter">
      <div className="auth-screen__panel">
        <div className="auth-screen__hero">
          <span className="eyebrow">EcoSort AI Access</span>
          <h1>Log in to continue your waste sorting journey.</h1>
          <p>
            Your scans, saved results, points, and impact metrics stay available
            on this device after you sign back in.
          </p>
        </div>

        <Card className="auth-card">
          <span className="card-label">Login</span>
          <h2>Welcome back</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
                minLength={6}
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                type="password"
                value={formData.password}
              />
            </label>

            <Button disabled={isSubmitting} fullWidth type="submit">
              {isSubmitting ? 'Logging In...' : 'Login'}
            </Button>
          </form>

          {feedback ? <p className="auth-feedback">{feedback}</p> : null}

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </Card>
      </div>
    </section>
  );
}

export default Login;
