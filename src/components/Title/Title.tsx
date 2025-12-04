'use client';

export const Title = (props: {
  title: string;
  type?: 'search' | 'category' | 'tag' | 'archive' | 'blog' | 'default';
  count?: number;
}) => {
  const getPrefix = () => {
    switch (props.type) {
      case 'category':
        return 'Category: ';
      case 'tag':
        return '#';
      case 'archive':
        return '';
      case 'search':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className='py-8 px-6 mb-6'>
      <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100'>
        {props.title === 'No Keyword' ? (
          <span className='text-slate-400'>キーワードが入力されていません</span>
        ) : (
          <>
            <span className='text-slate-500 dark:text-slate-400 font-normal'>{getPrefix()}</span>
            {props.title}
          </>
        )}
      </h1>

      {props.type === 'search' && props.title !== 'No Keyword' && (
        <p className='text-sm text-slate-500 dark:text-slate-400 mt-2'>
          「{props.title}」の検索結果
        </p>
      )}

      {props.count !== undefined && props.count > 0 && (
        <p className='text-sm text-slate-500 dark:text-slate-400 mt-2'>
          {props.count}件の記事
        </p>
      )}
    </div>
  );
};

export default Title;
