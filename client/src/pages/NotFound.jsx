import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-extrabold text-white mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist. It might have been moved or the URL is incorrect.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <HiHome className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
