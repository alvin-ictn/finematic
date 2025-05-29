import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-xl py-2 px-5 text-base font-medium bg-gray-950 text-input flex items-center gap-2 justify-center cursor-pointer hover:opacity-90 border-white/30 border hover:border-border"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
