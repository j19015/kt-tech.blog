import Link from "next/link";

type PaginateProps = {
  currentPage: number;
  totalPage: number;
  kind :string;
};

const Paginate = ({ currentPage, totalPage,kind }: PaginateProps) => {
  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex">
        {currentPage > 1 && (
          <Link href={`${kind}/page/${currentPage - 1}`}>
            <span className="paginate-button-color hover:paginate-button-hover-color  paginate-button-text-color px-4 py-2 rounded-l  cursor-pointer">
              前へ
            </span>
          </Link>
        )}
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
          <Link href={`${kind}/page/${page}`} key={page}>
            <span
              className={`${
                currentPage === page
                  ? " paginate-current-button-color paginate-current-button-text-color "
                  : "paginate-button-color hover:paginate-button-hover-color paginate-button-text-color "
                 
              } px-4 py-2 cursor-pointer`}
            >
              {page}
            </span>
          </Link>
        ))}
        {currentPage < totalPage && (
          <Link href={`${kind}/page/${currentPage + 1}`}>
            <span className="paginate-button-color hover:paginate-button-hover-color paginate-button-text-color px-4 py-2 rounded-r cursor-pointer">
              次へ
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Paginate;
