import type { AxiosError } from "axios";
import { ArrowLeftIcon } from "lucide-react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type ErrorFallbackProps = {
  error: {
    error: AxiosError<{ status_message?: string }>;
    custom_message?: string;
    id?: string;
  };
};

const ErrorFallback: FC<ErrorFallbackProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 text-center min-h-screen h-screen flex justify-center items-center">
      <div className="flex items-center flex-col bg-red-900/20 text-red-400 p-6 rounded-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">Error Loading Movie</h2>

        <p className="mb-4">
          {error?.error?.response?.data?.status_message ??
            error?.error?.message ??
            "Something wrong"}
        </p>
        {error?.custom_message && (
          <p className="mb-4">{error?.custom_message}</p>
        )}
        <button
          onClick={() => navigate("/")}
          className="rounded-xl py-2 px-5 text-base font-medium bg-gray-950 text-input flex items-center gap-2 justify-center cursor-pointer hover:opacity-90 border border-foreground hover:border-border"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
