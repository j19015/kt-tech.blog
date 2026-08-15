type TitleType = 'search' | 'category' | 'tag' | 'archive' | 'blog' | 'default';

/** 見出しの上に出す小さなラベル。何の一覧なのかを一目で分かるようにする */
const LABELS: Partial<Record<TitleType, string>> = {
  category: 'Category',
  tag: 'Tag',
  archive: 'Archive',
  search: 'Search',
};

export const Title = (props: { title: string; type?: TitleType; count?: number }) => {
  const label = props.type ? LABELS[props.type] : undefined;
  // タグだけは # を見出しに直接付けたほうが自然
  const heading = props.type === 'tag' ? `#${props.title}` : props.title;

  return (
    // 一覧（Index）と左端を揃える
    <div className='max-w-3xl mx-auto px-4 pt-2 pb-6'>
      {label && (
        <p className='text-xs font-normal uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5'>
          {label}
        </p>
      )}
      <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 break-words'>
        {heading}
      </h1>
      {props.count !== undefined && props.count > 0 && (
        <p className='text-sm text-slate-500 dark:text-slate-400 mt-2'>{props.count}件の記事</p>
      )}
    </div>
  );
};

export default Title;
