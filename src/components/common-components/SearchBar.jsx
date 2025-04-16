import { useState, useEffect, useRef } from 'react';
import Styles from './SearchBar.module.css';
import googleLensIcon from '../../assets/G_lens.svg';
import googleMic from '../../assets/G_mic.svg';
import searchIcon from '../../assets/search.svg';
import backButton from '../../assets/backButton.svg';
import language from '../../assets/language.svg';
import song from '../../assets/song.svg';
import clockIcon from '../../assets/searchHistory.svg';
import searchResult from '../../assets/result.svg';
import submitSearchIcon from '../../assets/submitSearch.svg';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import GoogleLens from '../GoogleLens';

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [showLensOverlay, setShowLensOverlay] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [placeholderText, setPlaceholderText] = useState ('Search')
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

 
  const recentSearches = [
    'how do i google something',
    'how to look fabulous on a budget',
    'Okay Google, google google',
    'Do fish have feelings?',
    'how to fix broken humor',
    'can you die from too much Netflix?'
  ];

  useEffect(() => {
    
    let scrollY = 0;
    
    if (inputFocused) {
      scrollY = window.scrollY;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {

      const scrollY = parseInt((document.body.style.top || '0').replace('px', '')) * -1;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      window.scrollTo(0, scrollY);
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (document.body.style.top) {
        const scrollY = parseInt(document.body.style.top.replace('px', '')) * -1;
        window.scrollTo(0, scrollY);
      }
    };
  }, [inputFocused]);
  

  useEffect(() => {
    if (recognizedText && inputRef.current) {
      inputRef.current.value = recognizedText;
      setSearchText(recognizedText);
    }
  }, [recognizedText]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setInputFocused(false);
      }
    };
  
    if (inputFocused) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [inputFocused]);


  useEffect(() => {
     const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (isListening) {
        if (Capacitor.isPluginAvailable('SpeechRecognition')) {
          SpeechRecognition.stop();
          SpeechRecognition.removeAllListeners();
        }
      }
    };
  }, [isListening]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  };

 const handleFocus = () => {
  setPlaceholderText('Search or type URL');
  setInputFocused(true)
};

const handleBlur = () => {
  if (suggestionsRef.current && !suggestionsRef.current.contains(e.relatedTarget)) {
    setPlaceholderText('Search');
    setInputFocused(false);
  }
}
  const submitSearch = () => {
    if (searchText.trim()) {
      setInputFocused(false);
      setShowSearchResults(true);
    }
  };

  const handleSearchItemClick = (text) => {
    setSearchText(text);
    if (inputRef.current) {
      inputRef.current.value = text;
    }
    submitSearch();
  };

  const handleMicClick = async () => {
    setShowVoiceOverlay(true);
    setRecognizedText('');

    const isWeb = Capacitor.getPlatform() === 'web';

    if (isWeb) {
      const webSpeechAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

      if (webSpeechAvailable) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setRecognizedText(transcript);

          if (event.results[0][0].isFinal) {
            setSearchText(transcript);

            setTimeout(() => {
              setShowVoiceOverlay(false);
              if (inputRef.current) {
                inputRef.current.value = transcript;
              }
            }, 1000);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setShowVoiceOverlay(false);
        };

        recognition.onend = () => setIsListening(false);
        recognition.start();
      } else {
        setShowVoiceOverlay(false);
        alert('Voice search is not supported on this browser');
      }

      return;
    }

    if (Capacitor.isPluginAvailable('SpeechRecognition')) {
      try {
        const { available } = await SpeechRecognition.available();

        if (available) {
          setIsListening(true);

          await SpeechRecognition.start({
            language: 'en-US',
            maxResults: 1,
            prompt: 'Speak now...',
            partialResults: true,
            popup: false
          });

          SpeechRecognition.addListener('partialResults', (data) => {
            if (data.matches && data.matches.length > 0) {
              setRecognizedText(data.matches[0]);
            }
          });

          SpeechRecognition.addListener('results', (data) => {
            if (data.matches && data.matches[0]) {
              const finalText = data.matches[0];
              setSearchText(finalText);
              setRecognizedText(finalText);
              setIsListening(false);

              SpeechRecognition.removeAllListeners();

              setTimeout(() => {
                setShowVoiceOverlay(false);
                if (inputRef.current) {
                  inputRef.current.value = finalText;
                }
              }, 1000);
            }
          });
        } else {
          alert('Voice search is not supported on this device');
          setShowVoiceOverlay(false);
        }
      } catch (e) {
        console.error('Error accessing speech recognition: ', e);
        setIsListening(false);
        setShowVoiceOverlay(false);
      }
    }
  };

  const handleLensClick = () => {
    setShowLensOverlay(true);
  };

  const closeLensOverlay = () => {
    setShowLensOverlay(false);
  };

  const clearSearch = () => {
    setSearchText('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const closeVoiceOverlay = () => {
    setShowVoiceOverlay(false);
    setIsListening(false);
    if (Capacitor.isPluginAvailable('SpeechRecognition')) {
      SpeechRecognition.stop();
      SpeechRecognition.removeAllListeners();
    }
  };

  const searchSong = () => {
    if (recognizedText) {
      setSearchText(recognizedText);
      setShowVoiceOverlay(false);
      if (inputRef.current) {
        inputRef.current.value = recognizedText;
      }
    }
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
    setShowVoiceOverlay(false)
    setSearchText('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <div className={Styles.searchContainer}>
        <div className={Styles.inputWrapper}>
          {!inputFocused && (
            <img
              src={searchIcon}
              alt='search'
              className={Styles.searchIcon}
            />
          )}
          {inputFocused && (
            <button className={Styles.backButton} onClick={() => setInputFocused(false)}>
              <img
                src={backButton}
                alt='search'
                className={Styles.searchIcon}
              />
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholderText}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={Styles.input}
          />
          {searchText && (
            <button onClick={submitSearch} className={Styles.actionButton}>
              <img src={submitSearchIcon}
                alt="Submit"
                className={Styles.searchIcon}
              />
            </button>
          )}

          {searchText && (
            <button onClick={clearSearch} className={Styles.clearButton}>
              <span className={Styles.searchIcon}>X</span>
            </button>
          )}
        </div>

        <button onClick={handleMicClick} className={Styles.actionButton}>
          <img src={googleMic}
            alt="Voice Search"
            className={Styles.buttonIcon}
          />
        </button>

        <button onClick={handleLensClick} className={Styles.actionButton}>
          <img src={googleLensIcon}
            alt="Image Search"
            className={Styles.buttonIcon}
          />
        </button>
      </div>

      {inputFocused && (
        <div className={Styles.suggestionsContainer} ref={suggestionsRef}>
          <div className={Styles.suggestionsHeader}>
            <span>Recent searches</span>
            <button className={Styles.manageButton}>MANAGE HISTORY</button>
          </div>
          <div className={Styles.suggestionsList}>
            {recentSearches.map((item, index) => (
              <div key={index} className={Styles.suggestionItem} onClick={() => handleSearchItemClick(item)}>
                <img src={clockIcon}
                  alt="Back"
                  className={Styles.backButton}
                  style={{ marginRight: '10px', opacity: '80%' }}
                />
                <span className={Styles.suggestionText}>{item}</span>
              </div>
            ))}
          </div>
          <div className={Styles.incognitoSwitch}>
            <label className={Styles.switchLabel}>
              <input type="checkbox" className={Styles.switchInput} />
              <span className={Styles.switchSlider}></span>
              <span>Incognito mode</span>
            </label>
          </div>
        </div>
      )}

      {showVoiceOverlay && (
        <div className={Styles.voiceSearchContainer}>
          <div className={Styles.voiceSearchHeader}>
            <button onClick={closeVoiceOverlay} className={Styles.backButton}>
              <img src={backButton}
                alt="Back"
                className={Styles.backButton}
              />
            </button>

            <button className={Styles.backButton}>
              <img src={language}
                alt="language"
                className={Styles.languageButton}
              />
            </button>
          </div>

          <div className={Styles.voiceSearchContent}>
            {recognizedText ? (
              <div className={Styles.recognizedText}>
                {recognizedText}
              </div>
            ) : (
              <div className={Styles.speakNowText}>
                Speak now
              </div>
            )}

            <div className={Styles.dotsContainer}>
              <div className={`${Styles.dot} ${Styles.dotBlue}`}></div>
              <div className={`${Styles.dot} ${Styles.dotRed}`}></div>
              <div className={`${Styles.dot} ${Styles.dotYellow}`}></div>
              <div className={`${Styles.dot} ${Styles.dotGreen}`}></div>
            </div>
          </div>

          <button onClick={searchSong} className={Styles.songSearchButton}>
            <img src={song}
              alt="song"
              className={Styles.buttonIcon}
            />
            Search a song
          </button>
        </div>
      )}

      <GoogleLens
        isVisible={showLensOverlay}
        onClose={closeLensOverlay}
      />

      
      {showSearchResults && (
        <div className={Styles.searchResultsContainer}>
          <div className={Styles.searchResultsHeader}>

            <button onClick={closeSearchResults} className={Styles.backButton}>
              <img src={backButton}
                alt="Back"
                className={Styles.backButton}
              />

            </button>
            <h2>Search Results for: {searchText}</h2>
          </div>

          <div className={Styles.resultsContainer}>
            <div className={Styles.noResultsImage}>
              <img src={searchResult} className={Styles.searchResultIcon} />
            </div>
            <h3 className={Styles.title}>Oops! Your search broke the internet!</h3>
            <p className={Styles.text}>
              We searched high and low, but "{searchText}" was too powerful for our servers.
              Maybe try something less awesome?
            </p>
            <div className={Styles.stats}>
              <p>Search Time: Too long</p>
              <p>Results Found: Exactly zero</p>
              <p>Server Mood: Confused</p>
            </div>
            <button className={Styles.tryAgainButton} onClick={closeSearchResults}>
              Try Another Search
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;