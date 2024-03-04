'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBlog, faCode, faUser } from '@fortawesome/free-solid-svg-icons';

export const Header = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('Home');

  const handleMenuOpen = () => {
    setOpen(!isOpen);
  };

  const handleMenuClose = (menuName: string) => {
    setOpen(false);
    setSelected(menuName);
  };

  return (
    <header className='py-6 px-4 flex justify-between items-center rounded-lg m-1'>
      <Link className='z-50' href='/' onClick={() => handleMenuClose('Home')}>
        <h1 className={`text-3xl font-serif transition duration-300`}>kt-tech.blog</h1>
      </Link>

      <nav
        className={
          isOpen
            ? 'z-40 content fixed top-0 right-0 bottom-0 left-0 h-screen flex flex-col'
            : 'right-[-100%] md:right-4'
        }
      >
        <ul
          className={
            isOpen
              ? 'flex h-screen justify-center items-center flex-col gap-6 text-xl'
              : ' hidden block md:flex md:gap-8'
          }
        >
          {['Home', 'Blog', 'About'].map((menu) => (
            <li key={menu}>
              <Link
                onClick={() => handleMenuClose(menu)}
                href={
                  menu === 'Blog'
                    ? '/blogs/page/1'
                    : menu === 'Home'
                    ? '/'
                    : `/${menu.toLowerCase()}`
                }
              >
                <span
                  className={`font-serif transition duration-300 ${
                    selected === menu ? 'text-indigo-500' : 'hover:text-indigo-500'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={menu === 'Home' ? faHome : menu === 'Blog' ? faBlog : faUser}
                    className='mr-1'
                  />
                  {menu}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className='z-50 space-y-2 md:hidden' onClick={handleMenuOpen}>
        <span
          className={
            isOpen
              ? 'block w-8 h-0.5 reverce-color transform translate-y-2.5 rotate-45 duration-300'
              : 'block w-8 h-0.5 reverce-color duration-300'
          }
        />
        <span
          className={
            isOpen ? 'block opacity-0 duration-300' : 'block w-8 h-0.5 reverce-color duration-300'
          }
        />
        <span
          className={
            isOpen
              ? 'block w-8 h-0.5 reverce-color transform -rotate-45 duration-300'
              : 'block w-8 h-0.5 reverce-color duration-300'
          }
        />
      </button>
    </header>
  );
};

export default Header;
