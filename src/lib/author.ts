/**
 * 著者（Koki）の情報。構造化データ・フッター・記事末の著者カードで同じものを使う。
 *
 * 以前は JSON-LD の Person がページごとに違っていた（#594）。
 * - layout の Blog: url が GitHub
 * - トップの WebSite と記事の Article: url が /about
 * @id も無く、検索エンジンからは同じ人だと結び付けにくかった。
 * Qiita（@takakou）からはこのブログへリンクしているのに、こちらからは
 * どこにも Qiita へのリンクがなかった。
 *
 * Zenn はプロフィールの URL を確かめられていないので入れていない。
 */

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const AUTHOR_NAME = 'Koki';
export const AUTHOR_URL = `${siteUrl}/about`;
/** すべての JSON-LD で同じ人を指すための識別子 */
export const AUTHOR_ID = `${AUTHOR_URL}#person`;

export const AUTHOR_PROFILES = {
  github: 'https://github.com/j19015',
  x: 'https://x.com/tech_koki',
  qiita: 'https://qiita.com/takakou',
} as const;

/** JSON-LD の Person。どのページでも同じ @id・url・sameAs を出す */
export const authorJsonLd = () => ({
  '@type': 'Person',
  '@id': AUTHOR_ID,
  name: AUTHOR_NAME,
  url: AUTHOR_URL,
  sameAs: [AUTHOR_PROFILES.github, AUTHOR_PROFILES.x, AUTHOR_PROFILES.qiita],
});
