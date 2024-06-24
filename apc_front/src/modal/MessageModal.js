import React from 'react';

const MessageModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 opacity-75"></div>
        </div>
        <div className="relative bg-sub border border-bor rounded-lg p-8 max-w-md mx-auto">
          <div className="mb-6">
            <p className="text-lg">{message}</p>
          </div>
          <div className="flex justify-end">
            <button
              className="mr-2 px-4 py-2 bg-button2 text-white rounded hover:bg-green-600 focus:outline-none focus:bg-green-600"
              onClick={onConfirm}
            >
              확인
            </button>
            <button
              className="px-4 py-2 bg-button4 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
              onClick={onCancel}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
