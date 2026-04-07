import Header from './Header';
import '../../styles/components/layout.css';

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="layout-main">{children}</main>
    </div>
  );
}

export default MainLayout;
