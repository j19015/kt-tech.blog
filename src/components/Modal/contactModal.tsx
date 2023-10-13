import React from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose } :ContactModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative w-3/4 max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
        <button 
            onClick={onClose} 
            className="absolute right-6 top-6 text-2xl text-black transition duration-300"
            >
            <span className='p-1 hover:bg-gray-300 hover:text-white rounded-full'>
                ✖︎
            </span>
        </button>

        <h2 className="text-3xl font-semibold mb-3 text-black">Contact Us</h2>
        <p className="text-red-500">※現在作成中のため動作しません。</p>
        <p className="text-red-500 mb-6"><a href="https://twitter.com/tech_koki" className='underline'>Twitter</a>へ連絡をお願いします。</p>

        <form action="#" method="POST" className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border-b-2 focus:border-indigo-500 focus:outline-none py-2 text-black"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full border-b-2 focus:border-indigo-500 focus:outline-none py-2 text-black"
              required
            />
          </div>

          <div>
            <textarea
              name="message"
              rows={4}
              placeholder="Your Message"
              className="w-full border-2 focus:border-indigo-500 focus:outline-none p-2 rounded-md text-black"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
