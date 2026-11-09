// Cloudflare Pages のバインディングと環境変数の型。
// `getOptionalRequestContext()?.env` がこの形になる。
//
// どちらも無い環境（wrangler.dev.toml を通さない起動、バインドしていないプレビュー）が
// あるので optional にしてある。
interface CloudflareEnv {
  /** 「参考になった」の件数（D1: kt-tech-blog-reactions） */
  DB?: D1Database;
  /** Turnstile のシークレット。Pages の Secret に置く */
  TURNSTILE_SECRET_KEY?: string;
}

// D1 の型は @cloudflare/workers-types にあるが、入れると fetch / Response などの
// グローバルが DOM の型と二重定義になる。使う分だけここに書く。
// tsconfig が skipLibCheck なので、ここに書いていない型名を参照しても
// エラーにならず黙って any になる。足すときは必ずここに定義すること。
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: (string | number | null)[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}
