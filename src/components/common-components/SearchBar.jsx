import { useState, useEffect, useRef } from 'react';
import Styles from './SearchBar.module.css';
import googleLensIcon from '../../assets/G_lens.svg';
import googleMic from '../../assets/G_mic.svg';
import searchIcon from '../../assets/search.svg';
import backButton from '../../assets/backButton.svg';
import language from '../../assets/language.svg';
import song from '../../assets/song.svg';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import GoogleLens from '../GoogleLens';

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (isListening) {
        if (Capacitor.isPluginAvailable('SpeechRecognition')) {
          SpeechRecognition.stop();
          SpeechRecognition.removeAllListeners();
        }
      }
    }
  }, [isListening]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchText);
    }
  }

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
              onSearch(transcript);
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
                onSearch(finalText);
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


  const clearSearch = () => {
    setSearchText('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onSearch('');
  }

  const closeVoiceOverlay = () => {
    setShowVoiceOverlay(false);
    setIsListening(false);
    if (Capacitor.isPluginAvailable('SpeechRecognition')) {
      SpeechRecognition.stop();
      SpeechRecognition.removeAllListeners();
    }
  }

  const searchSong = () => {
    if (recognizedText) {
      setSearchText(recognizedText);
      setShowVoiceOverlay(false);
      onSearch(recognizedText);
      if (inputRef.current) {
        inputRef.current.value = recognizedText;
      }
    }
  }

  return (
    <>
      <div className={Styles.searchContainer}>
        <div className={Styles.inputWrapper}>
          <img
            src={searchIcon}
            alt='search'
            className={Styles.searchIcon}
          />
          <input
            ref={inputRef}
            type='text'
            placeholder='Search'
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className={Styles.input}
          />
          {searchText && (
            <button onClick={clearSearch} className={Styles.clearButton}>
              <span className={Styles.clearIcon}>X</span>
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
    </>
  );
};

export default SearchBar;