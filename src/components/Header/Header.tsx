import Link from 'next/link';

export const Header = () => {

//   const toggleMenu = () => {
//     const menu = document.getElementById('menu');
//     if (menu) {
//         menu.classList.toggle('hidden');
//     }
//   };

  return (
    <header className="bg-blue-500 p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">技術ブログ</h1>
        <div className="lg:hidden">
          <button
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div className="lg:flex lg:items-center" id="menu">
          <Link href="/" className="text-white hover:text-gray-300 px-4 py-2 block lg:inline">
              Home
          </Link>
          <Link href="/blogs" className="text-white hover:text-gray-300 px-4 py-2 block lg:inline">
              Blog
          </Link>
          <Link href="/dev" className="text-white hover:text-gray-300 px-4 py-2 block lg:inline">
              PF
          </Link>
          <Link href="/introduction" className="text-white hover:text-gray-300 px-4 py-2 block lg:inline">
              Introduction
          </Link>
          {/* 他のリンクを追加 */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
