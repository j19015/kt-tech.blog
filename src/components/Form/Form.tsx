import React from 'react';

export const Form = async () => {
    return (
        <div className="mb-10">
            <h3 className="text-xl font-bold mb-4">検索フォーム</h3>
            <form className="bg-gray-100 rounded-lg shadow-md p-4" action={`/searches`} method='get'>
                <div className="flex items-center border-b border-b-2 border-gray-300 py-2">
                    <input
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="text"
                        name="text"
                        placeholder="キーワードを入力"
                        aria-label="検索フォーム"
                    />
                    <button
                        className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded"
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
