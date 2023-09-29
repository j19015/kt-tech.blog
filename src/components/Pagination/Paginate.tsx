import Link from "next/link";

type PaginateProps = {
  currentPage: number;
  totalPage: number;
  kind :string;
};

const Paginate = ({ currentPage, totalPage }: PaginateProps) => {
  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex">
        {currentPage > 1 && (
          <Link href={`/blogs/page/${currentPage - 1}`}>
            <span className="bg-blue-500 text-white px-4 py-2 rounded-l hover:bg-blue-600 cursor-pointer">
              前へ
            </span>
          </Link>
        )}
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
          <Link href={`/blogs/page/${page}`} key={page}>
            <span
              className={`${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-500"
              } px-4 py-2 hover:bg-blue-200 cursor-pointer`}
            >
              {page}
            </span>
          </Link>
        ))}
        {currentPage < totalPage && (
          <Link href={`/blogs/page/${currentPage + 1}`}>
            <span className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 cursor-pointer">
              次へ
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Paginate;
