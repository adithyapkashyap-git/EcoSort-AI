import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

function PublicOnlyRoute() {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
