import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);

export default LoadingSpinner;