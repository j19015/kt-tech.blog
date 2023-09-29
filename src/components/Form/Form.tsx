import React from 'react';

export const Form = () => {
    return (
        <div className="mb-10">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">検索フォーム</h3>
            <form className="bg-gray-700 rounded-lg shadow-lg p-4 transition duration-300 ease-in-out transform hover:scale-105" action={`/searches`} method='get'>
                <div className="flex items-center border-b border-b-2 border-gray-500 py-2">
                    <input
                        className="appearance-none bg-transparent border-none w-full text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none focus:text-white"
                        type="text"
                        name="text"
                        placeholder="キーワードを入力"
                        aria-label="検索フォーム"
                    />
                    <button
                        className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded transition duration-300 ease-in-out transform hover:scale-105"
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
