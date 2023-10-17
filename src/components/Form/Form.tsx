import React from 'react';

export const Form = () => {
    return (
        <div className="mb-10">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">検索フォーム</h3>
            <form className="content rounded-lg shadow-lg p-4 transition duration-300 ease-in-out transform hover:scale-105" action={`/searches`} method='get'>
                <div className="flex items-center border-b border-gray-300 py-2">
                    <input
                        className="appearance-none bg-transparent border-none w-full text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none focus: "
                        type="text"
                        name="text"
                        placeholder="キーワードを入力"
                        aria-label="検索フォーム"
                    />
                    <button
                        className="flex-shrink-0 text-sm border-4 py-1 px-2 rounded transition duration-300 ease-in-out transform hover:scale-105 theme-button"
                        type="submit"
                    >
                        検索
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;
