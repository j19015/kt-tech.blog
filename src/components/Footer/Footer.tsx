"use client"
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import ContactModal from '../Modal/contactModal';
import PrivacyPolicyModal from '../Modal/privacyPolicy';

export const Footer = () => {
  const [iscontactOpen, setContactOpen] = useState(false);
  const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  return (
      
  <footer className="m-1">
      <div className="w-full mx-auto max-w-screen-xl p-8 md:flex md:items-center md:justify-between">
        <span className="text-sm sm:text-center">© 2023 <Link href="/" className="hover:underline">kt-tech.blog</Link>. All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
          <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6 ">About</Link>
          </li>
          <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</Link>
          </li>
          <li className="mr-4 hover:underline md:mr-6">
            <button onClick={() => setPrivacyPolicyOpen(true)} className="hover:underline">
                Lisencing
            </button>
          </li>
          <li>
            <button onClick={() => setContactOpen(true)} className="hover:underline">
                Contact
            </button>
          </li>
      </ul>
      </div>
      <ContactModal isOpen={iscontactOpen} onClose={() => setContactOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyPolicyOpen} onClose={() => setPrivacyPolicyOpen(false)} />
  </footer>

  );
};

export default Footer;
