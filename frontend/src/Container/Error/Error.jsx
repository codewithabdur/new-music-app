import { useNavigate } from 'react-router-dom';

const Error = () => {
const navigate = useNavigate();


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111] p-6">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#fff] mb-2">Page Not Found</h2>
        <p className="text-[#d6d6d6] mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <button
  onClick={() => navigate(`/`)}
  className="bg-[#04724e] hover:bg-[#0fa] cursor-pointer text-white px-6 py-2 rounded-lg transition"
>
  Go Home
</button>
      </div>
    </div>
  );
};

export default Error;
