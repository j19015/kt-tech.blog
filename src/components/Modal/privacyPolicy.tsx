import React from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose } :PrivacyPolicyModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative w-3/4 max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
        <button 
            onClick={onClose} 
            className="absolute right-6 top-6 text-2xl text-black transition duration-300"
            >
            <span className='p-1 hover:bg-gray-300 hover:  rounded-full'>
                ✖︎
            </span>
        </button>
        <h2 className="text-3xl font-semibold mb-3 text-black">Privacy Policy</h2>
        <h3>1.個人情報の利用目的</h3>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
