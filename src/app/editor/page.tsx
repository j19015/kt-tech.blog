'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import markdownToHtml from 'zenn-markdown-html';
import 'zenn-content-css';
import { ArrowLeft, Save, Eye, Edit3, Trash2, Plus } from 'lucide-react';

type Tag = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

type Article = {
  id: string;
  title: string;
  body: string;
  category?: string;
  tags?: string[];
  eyecatch?: string;
  createdAt?: string;
  publishedAt?: string;
};

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [article, setArticle] = useState<Article>({
    id: '',
    title: '',
    body: '',
    category: '',
    tags: [],
    eyecatch: '',
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState<{ id: string; filename: string }[]>([]);
  const [showArticleList, setShowArticleList] = useState(!editId);

  // タグとカテゴリを読み込み
  useEffect(() => {
    fetch('/api/metadata')
      .then(res => res.json())
      .then(data => {
        setTags(data.tags || []);
        setCategories(data.categories || []);
      })
      .catch(console.error);
  }, []);

  // 記事一覧を読み込み
  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
      })
      .catch(console.error);
  }, []);

  // 編集する記事を読み込み
  useEffect(() => {
    if (editId) {
      fetch(`/api/articles/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data.article) {
            setArticle(data.article);
            setShowArticleList(false);
          }
        })
        .catch(console.error);
    }
  }, [editId]);

  const handleSave = async () => {
    if (!article.title.trim()) {
      setMessage('タイトルを入力してください');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      const method = article.id ? 'PUT' : 'POST';
      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('保存しました');
        if (!article.id) {
          setArticle(prev => ({ ...prev, id: data.id }));
          router.push(`/editor?id=${data.id}`);
        }
        // 記事一覧を更新
        const listRes = await fetch('/api/articles');
        const listData = await listRes.json();
        setArticles(listData.articles || []);
      } else {
        setMessage('保存に失敗しました: ' + data.error);
      }
    } catch (error) {
      setMessage('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!article.id) return;
    if (!confirm('本当に削除しますか？')) return;

    try {
      const res = await fetch(`/api/articles?id=${article.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMessage('削除しました');
        setArticle({ id: '', title: '', body: '', category: '', tags: [], eyecatch: '' });
        router.push('/editor');
        setShowArticleList(true);
        // 記事一覧を更新
        const listRes = await fetch('/api/articles');
        const listData = await listRes.json();
        setArticles(listData.articles || []);
      } else {
        setMessage('削除に失敗しました');
      }
    } catch (error) {
      setMessage('削除に失敗しました');
    }
  };

  const handleNewArticle = () => {
    setArticle({ id: '', title: '', body: '', category: '', tags: [], eyecatch: '' });
    router.push('/editor');
    setShowArticleList(false);
  };

  const handleTagToggle = (tagId: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags?.includes(tagId)
        ? prev.tags.filter(t => t !== tagId)
        : [...(prev.tags || []), tagId],
    }));
  };

  const previewHtml = markdownToHtml(article.body || '');

  if (showArticleList) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              記事エディタ
            </h1>
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              サイトに戻る
            </Link>
          </div>

          <button
            onClick={handleNewArticle}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新規記事を作成
          </button>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-slate-100">
              記事一覧 ({articles.length}件)
            </h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {articles.map(a => (
                <Link
                  key={a.id}
                  href={`/editor?id=${a.id}`}
                  onClick={() => setShowArticleList(false)}
                  className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-slate-900 dark:text-slate-100">{a.id}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
                    ({a.filename})
                  </span>
                </Link>
              ))}
              {articles.length === 0 && (
                <p className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  記事がありません
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowArticleList(true)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              記事一覧
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {article.id ? `編集中: ${article.id}` : '新規記事'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {message && (
              <span className={`text-sm ${message.includes('失敗') ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </span>
            )}
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isPreview
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? '編集' : 'プレビュー'}
            </button>
            {article.id && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                削除
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar - メタデータ */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                タイトル
              </label>
              <input
                type="text"
                value={article.title}
                onChange={e => setArticle(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="記事のタイトル"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                カテゴリ
              </label>
              <select
                value={article.category || ''}
                onChange={e => setArticle(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">選択してください</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                タグ
              </label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      article.tags?.includes(tag.id)
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                アイキャッチ画像URL
              </label>
              <input
                type="text"
                value={article.eyecatch || ''}
                onChange={e => setArticle(prev => ({ ...prev, eyecatch: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
              {article.eyecatch && (
                <img
                  src={article.eyecatch}
                  alt="Preview"
                  className="mt-2 rounded-lg max-h-32 object-cover"
                />
              )}
            </div>
          </div>

          {/* Main - エディタ/プレビュー */}
          <div className="lg:col-span-3">
            {isPreview ? (
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 min-h-[600px]">
                <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                  {article.title || '無題'}
                </h1>
                <div
                  className="znc prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <textarea
                  value={article.body}
                  onChange={e => setArticle(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full h-[600px] p-4 bg-transparent text-slate-900 dark:text-slate-100 font-mono text-sm resize-none focus:outline-none"
                  placeholder="Markdownで記事を書く..."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
