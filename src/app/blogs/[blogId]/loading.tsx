/**
 * 記事詳細のスケルトン。
 *
 * 実物のレイアウトと構造が食い違っていたため、読み込み完了時に
 * 下のコンテンツが大きくずれていた。CLS を防ぐためのスケルトンが
 * CLS を起こしている状態だったので、順序と寸法を実物に合わせる。
 *
 * 実物の順序:
 *   パンくず → 本文カラム（タイトル → メタ行 → あとで読む → アイキャッチ → 本文）
 *            → 目次カラム（右、デスクトップのみ）
 */
const Bar = ({ className }: { className: string }) => (
  <div className={`rounded bg-slate-200 dark:bg-slate-700 ${className}`} />
);

export default function Loading() {
  return (
    <div className='animate-pulse' aria-hidden='true'>
      {/* パンくず。最後はカテゴリ名なので短い */}
      <div className='mb-6 flex items-center gap-2 px-4 py-3 lg:px-8'>
        <Bar className='h-4 w-10' />
        <Bar className='h-4 w-2' />
        <Bar className='h-4 w-10' />
        <Bar className='h-4 w-2' />
        <Bar className='h-4 w-20' />
      </div>

      <div className='mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3 lg:p-4'>
        {/* 本文カラム。DOM順は本文が先で、目次は order で右に回る */}
        <div className='lg:order-1 lg:col-span-2'>
          <div className='px-4'>
            {/* タイトルは2行になることが多い */}
            <Bar className='h-8 w-[90%]' />
            <Bar className='mt-2 h-8 w-[55%]' />

            {/* メタ行: カテゴリチップ + 日付 + 読了時間 */}
            <div className='mt-4 flex flex-wrap items-center gap-3'>
              <Bar className='h-6 w-20 rounded-full' />
              <Bar className='h-4 w-28' />
              <Bar className='h-4 w-24' />
            </div>

            {/* あとで読む */}
            <Bar className='mt-4 h-7 w-28 rounded-full' />

            {/* アイキャッチ（実物と同じ 21:9） */}
            <div className='mt-6 aspect-[21/9] w-full rounded-lg bg-slate-200 dark:bg-slate-700' />
          </div>

          {/* 本文 */}
          <div className='space-y-3 p-4 pt-8'>
            <Bar className='h-4 w-full' />
            <Bar className='h-4 w-[95%]' />
            <Bar className='h-4 w-[88%]' />
            <Bar className='mt-8 h-7 w-[45%]' />
            <Bar className='h-4 w-full' />
            <Bar className='h-4 w-[92%]' />
            <Bar className='h-4 w-[78%]' />
          </div>
        </div>

        {/* 目次カラム。実物は枠線なし + 半透明背景 */}
        <div className='hidden lg:order-2 lg:col-span-1 lg:block'>
          <div className='sticky top-20 rounded-lg bg-white/50 p-4 dark:bg-slate-900/50'>
            <Bar className='mb-4 h-4 w-12' />
            <div className='space-y-3'>
              <Bar className='h-3 w-[70%]' />
              <Bar className='h-3 w-[85%]' />
              <Bar className='h-3 w-[60%]' />
              <Bar className='h-3 w-[90%]' />
              <Bar className='h-3 w-[55%]' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
