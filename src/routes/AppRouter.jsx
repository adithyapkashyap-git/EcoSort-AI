import { Route, Routes } from 'react-router-dom';
import Chatbot from '../pages/Chatbot';
import Dashboard from '../pages/Dashboard';
import Gamification from '../pages/Gamification';
import Home from '../pages/Home';
import NearbyCenters from '../pages/NearbyCenters';
import Result from '../pages/Result';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<Result />} />
      <Route path="/centers" element={<NearbyCenters />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/gamification" element={<Gamification />} />
      <Route path="/chatbot" element={<Chatbot />} />
    </Routes>
  );
}

export default AppRouter;
