import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDetail, getList } from '../../../../libs/microcms';
import cheerio from 'cheerio';
import hljs from 'highlight.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag } from '@fortawesome/free-solid-svg-icons';
import markdownToHtml from 'zenn-markdown-html';
import 'zenn-content-css';
import '../../../../styles/markdown.css';
import '../../../../styles/default-dark.min.css';
import type { Metadata, ResolvingMetadata } from 'next';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { TableOfContents } from '@/components/TableOfContents/TableOfContents';
export async function generateStaticParams() {
  const { contents } = await getList();

  const paths = contents.map((blog) => {
    return {
      blogId: blog.id,
    };
  });
  return [...paths];
}

type Props = {
  params: { blogId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const blog = await getDetail(params.blogId);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = blog.eyecatch || [];

  // markdown->平文
  const html = markdownToHtml(blog.body);
  const $ = cheerio.load(html);
  const text = $('body').text();

  return {
    title: blog.title,
    description: text.slice(0, 100),
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: text.slice(0, 100),
      site: '@tech_koki',
      creator: '@tech_koki',
    },
    openGraph: {
      title: blog.title,
      description: text.slice(0, 100),
      locale: 'ja_JP',
      type: 'website',
      images: previousImages,
    },
    other: {
      thumbnail: blog.eyecatch?.url ? blog.eyecatch?.url : '',
    },
  };
}

async function fetchOGPData(url: string) {
  // localhostを含むURLの場合はカスタムのデータを返す
  if (url.includes('localhost')) {
    return {
      title: 'localhost', // タイトルにローカルホストと表示
      description: 'ローカル環境のリンクです', // 任意の説明
      image: '/images/no_image.jpeg', // デフォルト画像パス
    };
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const getMetaTag = (name: string) => {
      return (
        $(`meta[name=${name}]`).attr('content') ||
        $(`meta[property="og:${name}"]`).attr('content') ||
        $(`meta[property="twitter:${name}"]`).attr('content') ||
        $(`meta[name="og:${name}"]`).attr('content')
      );
    };

    const title = getMetaTag('title') || $('title').text();
    const description = getMetaTag('description') || $('meta[name="description"]').attr('content');
    const image = getMetaTag('image') || $('img').attr('src');
    const main_image = image
      ? image.includes('https')
        ? image
        : `${url}${image[0] == '/' ? image.substring(1) : image}`
      : '/images/no_image.jpeg';

    return {
      title,
      description,
      image: main_image,
    };
  } catch (error) {
    console.error(`Error fetching OGP for ${url}:`, error);
    return null; // エラーが発生した場合も何も返さない
  }
}

export default async function StaticDetailPage({
  params: { blogId },
}: {
  params: { blogId: string };
}) {
  const blog = await getDetail(blogId);
  const html = markdownToHtml(blog.body);
  const parse_body = cheerio.load(html);
  parse_body('pre code').each((_, elm) => {
    const result = hljs.highlightAuto(parse_body(elm).text());
    parse_body(elm).html(result.value);
    parse_body(elm).addClass('hljs');
  });

  // 重複なしで全てのリンクのhrefを取得
  const uniqueLinks: string[] = [];
  parse_body('a').each((_, link) => {
    const href = parse_body(link).attr('href');
    if (href && !href.startsWith('#') && !uniqueLinks.includes(href)) {
      uniqueLinks.push(href);
    }
  });

  // 各リンクのOGPデータを非同期で取得
  const ogpDataPromises = Array.from(uniqueLinks).map((href) => fetchOGPData(href));
  const ogpDataResults = await Promise.all(ogpDataPromises);

  // hrefとOGPデータをマッピング
  const hrefToOgpData = new Map();
  Array.from(uniqueLinks).forEach((href, index) => {
    hrefToOgpData.set(href, ogpDataResults[index]);
  });
  console.log(hrefToOgpData);

  // リンクカードの生成とHTMLの更新
  parse_body('a').each((_, link) => {
    const href = parse_body(link).attr('href');
    if (!href || href.startsWith('#')) {
      return;
    }

    const meta = hrefToOgpData.get(href);
    const linkCardHTML = `
      <div class="link-card mt-3 mb-3">
        <!-- リンクカードの内容 -->
        <a href="${href}" target="_blank" rel="noopener noreferrer">
          <div class="link-card-body">
            <div class="link-card-info">
              <div class="link-card-title">${meta.title}</div>
              <div class="link-card-url">${href}</div>
            </div>
            <img src="${meta.image}" class="link-card-thumbnail" />
          </div>
        </a>
      </div>
    `;

    parse_body(link.parent).replaceWith(linkCardHTML);
  });

  //目次機能
  const $ = cheerio.load(html);
  const headings = $('h1, h2').toArray();
  const toc = headings.map((element) => ({
    text: $(element).text(),
    id: (element as any).attribs.id,
    tag: (element as any).tagName,
  }));

  if (!blog) {
    notFound();
  }
  return (
    <>
      <div className='grid grid-cols-2 lg:grid-cols-3 lg:p-4'>
        <div className='lg:col-span-1 p-5 pl-7 pt-10 hidden lg:block float-right'>
          {' '}
          {/* 通常の画面サイズでは1列分のスペースを占有 */}
          <div className='p-5 rounded-lg table-contents'>
            <h1 className='text-2xl mb-5 font-bold'>目次</h1>
            <ul className='pl-2 scroll_bar'>
              {toc.map((data) => (
                <a href={`#${data.id}`}>
                  <li
                    key={data.id}
                    className={`${
                      data.tag == 'h2' ? 'ml-5' : data.tag == 'h3' ? 'ml-10' : 'ml-1'
                    } mb-2 hover:bg-gray-500 rounded p-0.5`}
                  >
                    {data.tag == 'h1' ? data.text : '-' + data.text}
                  </li>
                </a>
              ))}
            </ul>
          </div>
        </div>
        <div className='lg:col-span-2 col-span-3 lg:py-5 lg:px-3 rounded-lg shadow-lg content'>
          {' '}
          {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div>
            <div className='p-4'>
              <Link href={`/blogs/${blog.id}`}>
                <Image
                  src={blog.eyecatch?.url ? blog.eyecatch?.url : `../../../public/images/no_image`}
                  alt='画像'
                  width={10000}
                  height={10000}
                  className='rounded-lg'
                />
              </Link>
            </div>
            <div className='pl-6 pr-4 pb-1'>
              <Link key={blog.category?.id} href={`/categories/${blog.category?.id}`}>
                <div className='inline rounded-lg text-xs sm:text-base lg:text-base sub-text-color'>
                  <FontAwesomeIcon icon={faFolderOpen} /> {blog.category?.name}
                </div>
              </Link>
            </div>
            <div className='pl-6 pr-4 pb-1'>
              <ul className='list-disc list-inside '>
                {blog.tags?.map((tag) => (
                  <Link key={tag.id} href={`/tags/${tag.id}`}>
                    <span className='inline-block rounded-full text-xs sm:text-base lg:text-base mr-2 sub-text-color'>
                      <FontAwesomeIcon icon={faTag} /> {tag.name}
                    </span>
                  </Link>
                ))}
              </ul>
            </div>
            <div className='pl-6 pr-4'>
              <FontAwesomeIcon icon={faCalendarAlt} className='mr-1 sub-text-color' />
              <span className='mr-2 text-xs sm:text-base lg:text-base sub-text-color'>
                投稿日時:
              </span>
              <span className='text-xs sm:text-sm lg:text-base sub-text-color'>
                {new Date(blog.createdAt)
                  .toLocaleDateString('ja-JP', {
                    timeZone: 'Asia/Tokyo',
                  })
                  .replace(/\//g, '-')}
              </span>
            </div>
            <h1 className='p-4 mt-5 text-xl font-bold lg:text-3xl'>{blog.title}</h1>
            <TableOfContents toc={toc} />
            <div className='p-4 znc markdown'>
              <div dangerouslySetInnerHTML={{ __html: parse_body.html() }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
