import { initializeApp } from 'firebase/app';
import { useState, useEffect, useRef } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import downArrow from '../../assets/downArrow.svg';
import incognito from '../../assets/incognito.svg';
import searchHistory from '../../assets/searchHistory.svg';
import safeSearch from '../../assets/safeSearch.svg';
import interests from '../../assets/interests.svg';
import password from '../../assets/password.svg';
import yourProfile from '../../assets/yourProfile.svg';
import personalisedSearch from '../../assets/personalisedSearch.svg';
import settings from '../../assets/settings.svg';
import helpFeedback from '../../assets/helpFeedback.svg';
import signout from '../../assets/signout.svg';
import './SignIn.css';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID
};

console.log("firebase obj is : ", firebaseConfig)

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const SignIn = () => {

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  //checking if the signin state is changed
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    })

    return () => {
      unsubscribe()
    }
  }, [])

  //logic to close the dropdown if clicked anywhere apart from inside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }

  }, [])

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("An Error occurred while signing in : ", e);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      console.error("An Error occurred on sign out : ", e);
    }
    setDropdownOpen(false);
  }


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const getBackgroundColor = () => {
    if (!user?.email) return '#5F6368';

    const hash = user.email.split('').reduce(
      (acc, char) => char.charCodeAt(0) + acc, 0
    );

    const colors = [
      '#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#7B1FA2', '#0097A7',
    ];

    return colors[hash % colors.length];
  };



  const getUserInitial = () => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    return 'G';
  }

  return (
    <>
      <div className='signin-container' ref={dropdownRef}>
        {
          user ?
            (<>
              <div
                className='profile'
                onClick={toggleDropdown}
                title={user.displayName || 'User account'}
              >
                {
                  user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className='display-image'
                    />
                  ) : (
                    <div
                      className="profile-initial"
                      style={{ backgroundColor: getBackgroundColor() }}
                    >
                      {getUserInitial()}
                    </div>
                  )}
              </div>
              {dropdownOpen && (
                <div className='dropdown-container'>
                  <div className='dropdown-header'>
                    <button className='cross-button' onClick={() => setDropdownOpen(false)}>
                      X
                    </button>
                    <div className='g-text'>
                      Google
                    </div>
                    <div className='down-arrow'>
                      <img
                        src={downArrow}
                        className='icons'
                      />
                    </div>
                  </div>

                  <div className='user-info'>
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className='dropdown-display-image'
                      />
                    ) : (
                      <div
                        className="dropdown-profile-initial"
                        style={{ backgroundColor: getBackgroundColor() }}
                      >
                        {getUserInitial()}
                      </div>
                    )}
                    <div className='user-email-info'>
                      <div className='user-name'>{user.displayName}</div>
                      <div className='user-email'>{user.email}</div>
                    </div>
                  </div>

                  <button className='manage-google-account'>
                    Manage your Google Account
                  </button>
                  <div className='divider'></div>
                  <div className='dropdown-item-container'>
                    <div className='items'>
                      <div className='icons'>
                        <img src={incognito} />
                      </div>
                      <div className='item-text'>Turn on Incognito</div>
                    </div>

                    <div className='items'>
                      <div className='icons'>
                        <img src={searchHistory} />
                      </div>
                      <div className='item-text'>Search history</div>
                      <div className='item-text-right'>Saving</div>
                    </div>
                    <div className='sub-divider'></div>
                    <div className='items sub-item'>
                      <div className='item-text sub-text'>Delete last 15 mins</div>
                    </div>

                    <div className='items'>
                      <div className='icons'>
                        <img src={safeSearch} />
                      </div>
                      <div className='item-text'>SafeSearch</div>
                    </div>

                    <div className='items'>
                      <div className='icons'>
                        <img src={interests} />
                      </div>
                      <div className='item-text'>Interests</div>
                    </div>

                    <div className='items'>
                      <div className='icons'>
                        <img src={password} />
                      </div>
                      <div className='item-text'>Passwords</div>
                    </div>

                    <div className='items'>
                      <div className='icons'>
                        <img src={yourProfile} />
                      </div>
                      <div className='item-text'>Your profile</div>
                    </div>

                    <div className='items'>
                      <div className='icons'>
                        <img src={personalisedSearch} />
                      </div>
                      <div className='item-text'>Search personalisation</div>
                    </div>

                    <div className='divider'></div>

                    <div className='items'>
                      <div className='icons'>
                        <img src={settings} />
                      </div>
                      <div className='item-text'>Settings</div>
                    </div>

                    <div className='items'>
                      <div className='icons'>
                        <img src={helpFeedback} />
                      </div>
                      <div className='item-text'>Help and feedback</div>
                    </div>
                    <div className='divider'></div>

                    <div className='items' onClick={handleSignOut}>
                    <div className='icons'>
                        <img src={signout} />
                      </div>
                      <div className='item-text'>Sign out</div>
                    </div>
                    <div className='divider'></div>
                    <div className='footer'>
                      <span>Privacy Policy</span>
                      <span className='dot-separator'>•</span>
                      <span>Terms of Service</span>
                    </div>
                  </div>
                </div>
              )}
            </>
            ) : (
              <button
                onClick={handleSignIn}
                className='sign-in-button'
                title='Sign in with google'
              >
                Sign In
              </button>)
        }
      </div>
    </>
  )
}



export default SignIn;
