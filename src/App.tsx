import { usePrivy } from '@privy-io/react-auth';
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Navbar, Sidebar } from './components';
import { useStateContext } from './context';
import { Home, Onboarding, Profile, ScreenSchedule } from './pages';

const App: React.FC = () => {
  const navigate = useNavigate();
  // Only get what exists in the state context.
  const { currentUser } = useStateContext();
  // Get authentication-related values from usePrivy instead.
  const { user, login, ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      login();
    } else if (user && !currentUser) {
      navigate('/onboarding');
    }
  }, [user, authenticated, ready, login, currentUser, navigate]);

  return (
    <div className='sm:-8 relative flex min-h-screen flex-row bg-[#13131a] p-4'>
      <div className='relative mr-10 hidden sm:flex'>
        <Sidebar />
      </div>

      <div className='mx-auto max-w-[1280px] flex-1 max-sm:w-full sm:pr-5'>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/onboarding' element={<Onboarding />} />
          {/* <Route path='/medical-records' element={<MedicalRecords />} />
              <Route path='/medical-records/:id' element={<SingleRecordDetails />} /> */}
          <Route path='/screening-schedules' element={<ScreenSchedule />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
