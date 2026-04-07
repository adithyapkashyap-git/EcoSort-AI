import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/routing/ProtectedRoute';
import PublicOnlyRoute from '../components/routing/PublicOnlyRoute';
import Chatbot from '../pages/Chatbot';
import Dashboard from '../pages/Dashboard';
import Gamification from '../pages/Gamification';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NearbyCenters from '../pages/NearbyCenters';
import Result from '../pages/Result';
import Signup from '../pages/Signup';
import { useAppContext } from '../context/AppContext';

function AppRouter() {
  const { isAuthenticated } = useAppContext();

  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/centers" element={<NearbyCenters />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gamification" element={<Gamification />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Route>

      <Route
        path="*"
        element={<Navigate replace to={isAuthenticated ? '/' : '/login'} />}
      />
    </Routes>
  );
}

export default AppRouter;
