import { FormattedMessage } from "react-intl";

const Home = () => (
  <div className='min-h-screen bg-gradient-to-tr from-black via-purple-900 to-black'>
    <div className='p-8 md:flex md:justify-end md:items-center'>
      <header className='text-center mb-3 text-white font-bold font-sans text-xl md:mr-3 md:mb-0'>
        <FormattedMessage id="header" defaultMessage="GitHub User Search" />
      </header>
    </div>
  </div>
)

export default Home;
