
import { Calendar, CheckSquare } from 'lucide-react';

export const Header = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg mr-4">
          <CheckSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Life Admin
        </h1>
      </div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Stay on top of all your important life tasks - from bills and appointments to maintenance and deadlines. 
        Never let important admin tasks slip through the cracks again.
      </p>
    </div>
  );
};
