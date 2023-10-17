"use client"
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import ContactModal from '../Modal/contactModal';

export const Footer = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
      
  <footer className="m-1">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm sm:text-center">© 2023 <Link href="/" className="hover:underline">kt-tech.blog</Link>. All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
          <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6 ">About</Link>
          </li>
          <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</Link>
          </li>
          <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6">Licensing</Link>
          </li>
          <li>
            <button onClick={() => setModalOpen(true)} className="hover:underline">
                Contact
            </button>
          </li>
      </ul>
      </div>
      <ContactModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
  </footer>

  );
};

export default Footer;
