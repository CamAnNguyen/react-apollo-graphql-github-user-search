import { useCallback, useMemo, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import { SearchIcon } from "@heroicons/react/solid";

import { fetchUsers, setPage } from "store/users/actions";
import { getUsers } from "store/users/selectors";

import Table, { AvatarCell } from './components/Table';

const Home = () => {
  const textInput  = useRef() as React.MutableRefObject<HTMLInputElement>;

  const { data: users, currentPage, pageSize, totalCount } = useSelector(getUsers);

  const dispatch = useDispatch();

  const start = currentPage * pageSize;
  const end = start + pageSize;
  const data = users.slice(start, end);

  const tryFindUsers = (e: any) => {
    let check = e.key === 'Enter' || e.keyCode === 13;
    if (!check) return;

    if (textInput && textInput.current && textInput.current.value) {
      dispatch(fetchUsers(textInput.current.value));
    }
  }

  const { formatMessage } = useIntl();

  const columns = useMemo(() => [
    {
      Header: formatMessage({
        id: "home/user-name-header",
        defaultMessage: "User Name",
      }),
      accessor: 'name',
      Cell: AvatarCell,
      imgAccessor: "avatar_url",
      usernameAccessor: "login",
    },
  ], [formatMessage]);

  const fetchData = useCallback(({ pageIndex, pageSize }) => {
    const check = textInput && textInput.current && textInput.current.value;
    if (!check) return;

    const startRow = pageSize * pageIndex;
    const endRow = startRow + pageSize;

    if (endRow > users.length) {
      dispatch(fetchUsers(textInput.current.value, pageIndex, pageSize));
    } else {
      dispatch(setPage(pageIndex));
    }
  }, [dispatch, textInput, users]);

  return (
    <div className="main">
      <div className="px-4 sm:px-8 lg:px-16 xl:px-20 mx-auto">
        <div className="hero">
          <div className="hero-headline flex flex-col items-center justify-center pt-12 text-center">
            <h1 className=" font-bold text-3xl text-gray-900">
              <FormattedMessage id="home/header" defaultMessage="GitHub User Search" />
            </h1>
          </div>

          <div className="box pt-6">
            <div className="box-wrapper">
              <div className=" bg-white rounded flex items-center w-full p-3 shadow-sm border border-gray-200">
                <button className="outline-none focus:outline-none">
                  <SearchIcon className="w-5 text-gray-600 h-5 cursor-pointer" />
                </button>
                <input
                  x-model="q"
                  className="w-full pl-4 text-sm outline-none focus:outline-none bg-transparent"
                  type="search"
                  placeholder={formatMessage({
                    id: "home/search-placeholder",
                    defaultMessage: "Search user name",
                  })}
                  ref={textInput}
                  onKeyUp={tryFindUsers}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Table
              columns={columns}
              data={data}
              fetchData={fetchData}
              pageIndex={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
            />
          </div>
      </div>
    </div>
    </div>
  )
};

export default Home;
