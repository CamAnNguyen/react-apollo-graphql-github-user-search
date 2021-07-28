import { useState } from 'react';
import { useAsync } from 'react-async-hook';

import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';

const useDebouncedSearch = (searchFunction: (arg: any) => any) => {
  const [text, setText] = useState('');

  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );

  const searchResults = useAsync(
    async () => {
      if (text.length === 0) {
        return [];
      } else {
        return debouncedSearchFunction(text);
      }
    },
    [debouncedSearchFunction, text]
  );

  return {
    text,
    setText,
    searchResults,
  };
};

export default useDebouncedSearch;
