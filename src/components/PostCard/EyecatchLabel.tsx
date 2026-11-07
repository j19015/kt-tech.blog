import type { Blog } from '../../../libs/notion';

/**
 * アイキャッチの上に重ねる見出し語。
 *
 * アイキャッチは記事ごとに別の画像だが、どれも同じ配色・同じ作風で生成しているので、
 * 96〜250px のサムネイルでは見分けがつかなかった（#556）。
 * タイトルはカードの横にすでに出ているので、画像の上には記事を見分ける語を1つだけ置く。
 */
type LabelSource = Pick<Blog, 'id' | 'tags' | 'category'>;

/**
 * 一覧の上から順に、各記事へ「まだ他のカードで使っていないタグのうち先頭のもの」を割り当てる。
 *
 * - 単純に先頭のタグを使うと、同じ一覧に「Claude Code」が6件、連載の回は全部
 *   「Terminal」のように並び、ラベルを付けても見分けがつかなかった。
 * - 一覧で一番珍しいタグを選ぶと重複は減るが、「Python」「zsh」のような
 *   記事の主題から外れた脇役のタグが出てきた。
 *
 * Notion ではタグを主題に近い順に付けているので、先頭寄りのタグほど記事を表す。
 * 候補はカードに表示される先頭3つまで。4つ目以降は脇役のタグが多く、
 * カードのタグ一覧に無い語が画像にだけ出ると唐突に見えた。
 * 全部使用済みなら先頭のタグに戻し、タグが無ければカテゴリで代用する。
 */
const CANDIDATE_TAGS = 3;

export function pickEyecatchLabels(blogs: LabelSource[]): Map<string, string> {
  const used = new Set<string>();
  const labels = new Map<string, string>();
  for (const blog of blogs) {
    const names = (blog.tags ?? []).slice(0, CANDIDATE_TAGS).map((t) => t.name);
    const label = names.find((n) => !used.has(n)) ?? names[0] ?? blog.category?.name;
    if (!label) continue;
    used.add(label);
    labels.set(blog.id, label);
  }
  return labels;
}

type Props = {
  /** 未指定なら何も重ねない */
  label?: string;
  size?: 'sm' | 'md';
};

/** 親に `relative` と `overflow-hidden` が必要 */
export const EyecatchLabel = ({ label, size = 'sm' }: Props) => {
  if (!label) return null;

  return (
    // 同じ語は横のタグ一覧にもあるので、読み上げでは重複させない
    <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 bottom-0'>
      {/* 明るいアイキャッチでも白文字が読めるよう、文字の下は 75% まで暗くする */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent' />
      <p
        className={`relative font-bold leading-tight text-white line-clamp-2 break-words ${
          size === 'sm' ? 'px-1.5 pb-1.5 pt-5 text-[11px] sm:text-xs' : 'px-3 pb-2.5 pt-8 text-sm'
        }`}
      >
        {label}
      </p>
    </div>
  );
};
