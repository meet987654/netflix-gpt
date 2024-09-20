import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { addUser, removeUser } from '../utils/userSlice';
import { logo, userIcon } from '../utils/constants';
import { toggleGPTSearchView } from '../utils/gptSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  
  const handleSearchgpt=()=>{
    dispatch(toggleGPTSearchView())
  }
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        navigate('/error');
      });
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        dispatch(addUser({ uid, email, displayName }));
        navigate('/browse');
      } else {
        dispatch(removeUser());
        navigate('/');
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [dispatch, navigate]);

  return (
    <div className='justify-between flex py-10 px-10 absolute z-20 w-full bg-gradient-to-b from-black'>
      <img
        className='w-48'
        src={logo}
        alt='logo'
      />
      {user && (
        <div className='mt-10 flex font-jakarta'>
          <button className='py-3 px-4 bg-gray-200 bg-opacity-90 mx-8 rounded-lg font-semibold text-black'
          onClick={handleSearchgpt}
          
          >
            GPT Search
            </button>
          <img
            className='w-10 h-10 invert'
            src={userIcon}
            alt='userIcon'
          />
          <button
            className='mx-4 bg-red-700 text-white font-jakarta text-bold py-2 px-4 rounded-lg
            hover:py-2 hover:px-3 hover:transition-all linear .4s'
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
