import React from 'react';

const ErrorMessage = ({ message, onDismiss }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
    <div className="flex">
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <div className="mt-2 text-sm text-red-700">{message}</div>
        <div className="mt-4">
          <button
            onClick={onDismiss}
            className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ErrorMessage;