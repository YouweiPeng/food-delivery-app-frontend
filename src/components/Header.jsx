import logo from '../assets/logo.png';
import MUIButton from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="p-4 sm:p-6 shadow-md fixed top-0 left-0 right-0 flex items-center justify-between">
      {/* Left side: Logo and Heading */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="This is the logo of app"
          className="h-10 sm:h-12 mr-2 sm:mr-4 rounded-full cursor-pointer"
          onClick={() => navigate('/')}
        />
        <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold">三菜一汤</h1>
      </div>

      {/* Right side: Buttons */}
      <div className="flex space-x-2 sm:space-x-4">
        <MUIButton
          variant="contained"
          color="primary"
          onClick={() => navigate('/checkout')}
          sx={{
            padding: { xs: '6px 12px', custom360:'7px 14px', custom400: '10px 20px', lg: '12px 24px' },
            fontSize: { xs: '0.55rem', custom360:'0.6rem', custom400: '0.7rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          预约订餐
        </MUIButton>
        <MUIButton
          variant="contained"
          color="primary"
          onClick={() => navigate('/combo')}
          sx={{
            padding: { xs: '6px 12px',  custom360:'7px 14px', custom400: '10px 20px', lg: '12px 24px' },
            fontSize: { xs: '0.55rem', custom360:'0.6rem', custom400: '0.7rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          预约团餐
        </MUIButton>
      </div>
    </header>
  );
};

export default Header;
