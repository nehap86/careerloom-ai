import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assess from './pages/Assess';
import Explore from './pages/Explore';
import Roadmap from './pages/Roadmap';
import Settings from './pages/Settings';
import Insights from './pages/Insights';
import Jobs from './pages/Jobs';
import Resources from './pages/Resources';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/insights" element={<Insights />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/assess"
              element={<ProtectedRoute><Assess /></ProtectedRoute>}
            />
            <Route
              path="/explore"
              element={<ProtectedRoute><Explore /></ProtectedRoute>}
            />
            <Route
              path="/roadmap/:pathId"
              element={<ProtectedRoute><Roadmap /></ProtectedRoute>}
            />
            <Route
              path="/jobs"
              element={<ProtectedRoute><Jobs /></ProtectedRoute>}
            />
            <Route
              path="/resources"
              element={<Resources />}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><Settings /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
