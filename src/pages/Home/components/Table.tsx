import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useTable, useSortBy, usePagination } from "react-table";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

import { PageButton } from "./Buttons";
import { SortIcon, SortUpIcon, SortDownIcon } from "./Icons";

interface AvatarCellProps {
  readonly value: string;
  readonly column: any;
  readonly row: any;
};

export const AvatarCell = ({ value, column, row }: AvatarCellProps) => (
  <div className="flex items-center">
    <div className="flex-shrink-0 h-10 w-10">
      <img
        className="h-10 w-10 rounded-full"
        src={row.original[column.imgAccessor]}
        alt=""
      />
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">
        {row.original[column.usernameAccessor]}
      </div>
    </div>
  </div>
);

interface TableProps {
  readonly columns: any[];
  readonly data: Array<any>;
  readonly totalCount: number;
  readonly pageSize: number;
  readonly pageIndex: number;
  readonly fetchData: ({ pageSize, pageIndex }: any) => void;
};

const Table = ({
  columns,
  data,
  fetchData,
  pageIndex,
  totalCount,
  pageSize
}: TableProps) => {
  const pageCount = Math.ceil(totalCount / pageSize);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0, pageSize: 10 },
    manualPagination: true,
    pageCount,
  },
    useSortBy,
    usePagination,
  )

  useEffect(() => {
    fetchData({ pageIndex: pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  const nextPage = () => {
    if ((pageIndex + 1) * pageSize < totalCount) {
      fetchData({ pageIndex: pageIndex + 1, pageSize });
    }
  };

  const previousPage = () => {
    fetchData({ pageIndex: Math.max(0, pageIndex - 1), pageSize });
  };

  if (!data || data.length === 0) {
    return <span />;
  }

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min(totalCount, startRow + pageSize - 1);

  return (
    <>
      <div className="mt-4 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                        >
                          <div className="flex items-center justify-between">
                            {column.render('Header')}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? <SortDownIcon className="w-4 h-4 text-gray-400" />
                                  : <SortUpIcon className="w-4 h-4 text-gray-400" />
                                : (
                                  <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.map((row, i) => {
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => (
                          <td
                            {...cell.getCellProps()}
                            className="px-6 py-4 whitespace-nowrap"
                            role="cell"
                          >
                            <div className="text-sm text-gray-500">
                              {cell.render('Cell')}
                            </div>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="py-3 flex items-center justify-between">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <FormattedMessage id="table/showing" defaultMessage="Showing" />
            {` ${startRow} - ${endRow} `}
            <FormattedMessage id="table/of" defaultMessage="of" />
            {` ${totalCount} `}
            <FormattedMessage id="table/records" defaultMessage="records" />
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <PageButton onClick={() => previousPage()}>
                <ChevronLeftIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton>
                <span className="text-sm text-gray-700">
                  <span className="font-medium mx-1">
                    {pageIndex + 1}
                  </span>
                  /
                  <span className="font-medium mx-1">{pageCount}</span>
                </span>
              </PageButton>
              <PageButton onClick={() => nextPage()}>
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default Table;
