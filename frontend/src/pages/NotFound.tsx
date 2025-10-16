import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-warmWhite dark:bg-charcoal">
      <div className="scandi-card text-center">
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">Page not found</h2>
        <p className="scandi-muted mb-4">We couldn't find what you were looking for.</p>
        <Link to="/" className="scandi-btn">Go home</Link>
      </div>
    </div>
  );
}
