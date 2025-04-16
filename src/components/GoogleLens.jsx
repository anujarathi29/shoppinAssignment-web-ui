import { useState, useEffect } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import Styles from './GoogleLens.module.css';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import backIcon from '../assets/backButton.svg';
import searchIcon from '../assets/search.svg';
import searchIconWhite from '../assets/searchWhite.svg';
import translateIcon from '../assets/translateIcon.svg';
import homeworkIcon from '../assets/homeworkIcon.svg';
import moreIcon from '../assets/moreIcon.svg';
import historyIcon from '../assets/searchHistory.svg';
import flashOff from '../assets/flashOff.svg';

const GoogleLens = ({ isVisible, onClose }) => {
  const [photoURI, setPhotoURI] = useState(null);
  const [isProcessing, setProcessing] = useState(false);
  const [mode, setMode] = useState('search');
  const [showFeedback, setShowFeedback] = useState(true);
  const [data, setData] = useState(null);



  useEffect(() => {
    if (isVisible) {
      defineCustomElements(window)
      openCamera();
      
    }
  }, [isVisible]);

  const openCamera = async () => {
    
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: 'CAMERA',
      });
      setPhotoURI(image.webPath);
    } catch (err) {
      console.error('Camera launch cancelled or failed:', err);
    }
  };

  const analyzeImage = () => {
    if (!photoURI) return;
    setProcessing(true);
    setTimeout(() => {
      let result;
      switch (mode) {
        case 'search':
          
          result = {
            label: 'Knitted Top',
            categories: ['All', 'Products', 'Visual matches', 'About this image'],
            products: [
              { 
                id: 1, 
                title: 'Amazon.com: GulirlFei Women\'s Two Piece...',
                image: 'https://picsum.photos/id/12/600/800',
                source: 'Amazon.com'
              },
              { 
                id: 2, 
                title: 'Buy Trendyol Striped Cotton Top - Tops for Women',
                image: 'https://picsum.photos/id/29/600/800',
                source: 'Myntra'
              },
              { 
                id: 3, 
                title: 'Purple Knitted Top',
                image: 'https://picsum.photos/id/5/600/800',
                source : 'Pinterest'
              }
            ]
          };
          break;
        case 'translate':
          result = { from: 'English', translated: 'QWERTY Keyboard Layout' };
          break;
        case 'homework':
          result = {
            subject: 'Computer Science',
            explanation: 'QWERTY is a keyboard layout developed for typewriters and still used today.'
          };
          break;
      }
      setData(result);
      setProcessing(false);
    }, 1500);
  };

  const resetSession = () => {
    setPhotoURI(null);
    setData(null);
    openCamera();
  };

  const closeFeedback = () => {
      setShowFeedback(false)
  }

  const switchMode = (newMode) => {
    setMode(newMode);
    if (photoURI || data) resetSession();
  };


  const handleBack = () => {
    window.location.reload()
  }

  return (
    <div className={`${Styles.lensContainer} ${isVisible ? Styles.visible : ''}`}>
      <header className={Styles.lensHeader}>
        <button className={Styles.headerButton} onClick={onClose}>
          <img src={backIcon} alt="Back" />
        </button>
        <button className={Styles.headerButton} onClick={onClose}>
          <img src={flashOff} alt="Flash" />
        </button>
        <div className={Styles.lensTitle}>Google Lens</div>
        <div className={Styles.headerRightButtons}>
          <button className={Styles.headerButton} disabled><img src={historyIcon} alt="History" /></button>
          <button className={Styles.headerButton} disabled><img src={moreIcon} alt="More" /></button>
        </div>
      </header>

      <main className={Styles.cameraView}>
        {photoURI && !data && !isProcessing && (
          <div className={Styles.capturedPreview}>
            <img src={photoURI} alt="Preview" className={Styles.capturedImage} />
            <button onClick={analyzeImage} className={Styles.searchCapturedBtn}>
              <img src={searchIcon} alt="Search" className={Styles.searchIcon} />
            </button>
          </div>
        )}
        {photoURI && isProcessing && <img src={photoURI} alt="Processing" className={Styles.capturedImage} />}
      </main>

      {!photoURI && !data && !isProcessing && (
        <div className={Styles.cameraControls}>
          <div className={Styles.bottomActions}>
            <div className={Styles.spacer}></div>
            <div className={Styles.spacer}></div>
          </div>

          <div className={Styles.modeSwitcher}>
            <button className={`${Styles.modeButton} ${mode === 'translate' ? Styles.activeMode : ''}`} onClick={() => switchMode('translate')}>
              <img src={translateIcon} alt="Translate" /><span>Translate</span>
            </button>
            <button className={`${Styles.modeButton} ${mode === 'search' ? Styles.activeMode : ''}`} onClick={() => switchMode('search')}>
              <img src={searchIconWhite} alt="Search" /><span>Search</span>
            </button>
            <button className={`${Styles.modeButton} ${mode === 'homework' ? Styles.activeMode : ''}`} onClick={() => switchMode('homework')}>
              <img src={homeworkIcon} alt="Homework" /><span>Homework</span>
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className={Styles.loadingScreen}>
          <div className={Styles.spinner}></div>
          <p>Processing image...</p>
        </div>
      )}

      {data && mode === 'translate' && (
        <div className={Styles.translationResult}>
          <p>Detected: {data.from}</p>
          <div className={Styles.translatedText}>{data.translated}</div>
          <button onClick={resetSession} className={Styles.newSearchBtn}>New Search</button>
        </div>
      )}

      {data && mode === 'homework' && (
        <div className={Styles.homeworkResult}>
          <h3>{data.subject}</h3>
          <p>{data.explanation}</p>
          <button onClick={resetSession} className={Styles.newSearchBtn}>New Search</button>
        </div>
      )}

     
      {data && mode === 'search' && (
        <div className={Styles.resultsView}>
          <div className={Styles.searchHeader}>
            <div className={Styles.searchArea}>
              <div className={Styles.searchInput}>
                {photoURI && <img src={photoURI} alt="" className={Styles.searchThumbnail} />}
                <span>Add to search</span>
              </div>
              <div className={Styles.profileCircle}>A</div>
            </div>
          </div>

    
          <div className={Styles.tabContainer}>
            {data.categories.map((tab, index) => (
              <button 
                key={index}
                className={`${Styles.tabButton} ${index === 0 ? Styles.activeTab : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
 
          <div className={Styles.infoNotice}>
            <span className={Styles.infoIcon}>ⓘ</span>
            <span>Results for people are limited</span>
          </div>
          
      
          <div className={Styles.productResults}>
            {data.products.map((product) => (
              <div key={product.id} className={Styles.productItem}>
                <div className={Styles.imageContainer}>
                  <img src={product.image} alt={product.title} className={Styles.productImage} />
                  {product.source && (
                    <div className={Styles.sourceTag}>
                      <span>{product.source}</span>
                    </div>
                  )}
                </div>
                <div className={Styles.productDetails}>
                  <div className={Styles.productName}>{product.title}</div>
                  {product.price && (
                    <div className={Styles.priceTag}>
                      {product.price}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
       
          <div className={Styles.moreResultsLink}>
            <span>See exact matches</span>
            <span className={Styles.arrowIcon}>›</span>
          </div>
          
          <button onClick={resetSession} className={Styles.resetBtn}>New Search</button>
        {showFeedback && <div className={Styles.feedbackBar}>
            <div className={Styles.feedbackQuestion}>Are these results useful?</div>
            <div className={Styles.feedbackOptions}>
              <button onClick={closeFeedback} className={Styles.feedbackBtn}>Yes</button>
              <button onClick={closeFeedback} className={Styles.feedbackBtn}>No</button>
              <button onClick={closeFeedback} className={Styles.closeBtn}>×</button>
            </div>
          </div>}

          <div className={Styles.bottomNav}>
            <button onClick={handleBack} className={Styles.navBtn}>
              <span className={Styles.navIcon}>←</span>
            </button>
            <button className={Styles.navBtn}>
              <span className={Styles.navIcon}>→</span>
            </button>
            <button className={Styles.navBtn}>
              <span className={Styles.navIcon}>⌂</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default GoogleLens;