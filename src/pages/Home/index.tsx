import { FormattedMessage, useIntl } from "react-intl";

import { ReactComponent as SearchLogo } from 'images/search-icon.svg';

const Home = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="main">
      <div className="px-4 sm:px-8 lg:px-16 xl:px-20 mx-auto">
        <div className="hero">
          <div className="hero-headline flex flex-col items-center justify-center pt-24 text-center">
            <h1 className=" font-bold text-3xl text-gray-900">
              <FormattedMessage id="home/header" defaultMessage="GitHub User Search" />
            </h1>
          </div>

          <div className="box pt-6">
            <div className="box-wrapper">
              <div className=" bg-white rounded flex items-center w-full p-3 shadow-sm border border-gray-200">
                <button className="outline-none focus:outline-none">
                  <SearchLogo className="w-5 text-gray-600 h-5 cursor-pointer" />
                </button>
                <input
                  x-model="q"
                  className="w-full pl-4 text-sm outline-none focus:outline-none bg-transparent"
                  type="search"
                  placeholder={formatMessage({
                    id: "home/search-placeholder",
                    defaultMessage: "Search user name",
                  })}
                />
              </div>
            </div>
          </div>
      </div>
    </div>
    </div>
  )
};

export default Home;
