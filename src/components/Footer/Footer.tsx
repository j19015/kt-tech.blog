import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-500 p-4 mt-8">
      <div className="container mx-auto">
        {/* フッターのコンテンツをここに追加 */}
        <p className="text-white">© 2023 技術ブログ</p>
      </div>
    </footer>
  );
};

export default Footer;
