import React, { useState, useEffect } from 'react';
import styles from './GoogleFeed.module.css';
import Clock from '../../assets/historyClock.svg';
import Home from '../../assets/homeIcon.svg';
import Bell from '../../assets/notification.svg';
import Menu from '../../assets/menuIcon.svg';
import imageSearch from '../../assets/imageSearch.svg';
import homeworkGreen from '../../assets/homeworkGreen.svg'
import translateBlue from '../../assets/translateBlue.svg'
import musicRed from '../../assets/musicRed.svg'


const GoogleFeed = () => {
    const [feedItems, setFeedItems] = useState([]);
    const [weatherContent, setWeatherContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                await new Promise(resolve => setTimeout(resolve, 1000));

                const dummyData = [
                    {
                        id: 1,
                        title: 'This superstar was Ratan Tata\'s closest friend, shared same room, went for picnics, listened songs together',
                        location: 'Gurugram',
                        temperature: '30°',
                        weatherIcon: '🌙',
                        airQuality: 'Moderate',
                        aqiValue: 170,
                        imageSrc: 'https://picsum.photos/id/6/600/800',
                    },
                    {
                        id: 2,
                        title: 'Breaking: Major tech company announces new AI product launch next week',
                        location: 'Mumbai',
                        temperature: '32°',
                        weatherIcon: '☀️',
                        airQuality: 'Poor',
                        aqiValue: 210,
                        imageSrc: 'https://picsum.photos/id/30/600/800',
                    },
                    {
                        id: 3,
                        title: 'Scientists discover new species in the Amazon rainforest',
                        location: 'Delhi',
                        temperature: '28°',
                        weatherIcon: '🌤️',
                        airQuality: 'Good',
                        aqiValue: 90,
                        imageSrc: 'https://picsum.photos/id/9/600/800',
                    }
                ];

                const dummyWeatherData = [
                    {
                        id: 1,
                        title: 'Gurugram',
                        subText1: '30°',
                        subText2: '🌙',
                    },
                    {
                        id: 2,
                        title: 'Air Quality . 170',
                        subText1: 'Moderate',
                        subText2: '☀️',
                    },
                    {
                        id: 3,
                        title: 'Trip due',
                        subText1: 'Hawai',
                        subText2: '🗓️',
                    },
                    {
                        id: 4,
                        title: '⚙️',
                        subText1: 'Custom Settings',
                        subText2: '',
                    },
                ];

                setWeatherContent(dummyWeatherData)
                setFeedItems(dummyData);
            } catch (error) {
                console.error('Error fetching feed data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    useEffect(()=> {
        console.log('Weather data is : ', weatherContent)
    },[weatherContent])

    if (loading) {
        return <div className={styles.loading}>Loading feed...</div>;
    }

    return (
        <div className={styles.topContainer}>
               <div className={styles.interests}>
                        <div className={styles.yellowTab}>
                            <img src={imageSearch}/>
                        </div>
                        <div className={styles.blueTab}>
                            <img src={translateBlue}/>
                        </div>
                        <div className={styles.greenTab}>
                            <img src={homeworkGreen}/>
                        </div>
                        <div className={styles.redTab}>
                            <img src={musicRed}/>
                        </div>
    </div>
             <div className={styles.cardHeader}>
            {weatherContent.map((item) => {
                 return (    
                        <div className={styles.infoContainer} key={item.id}>
                            <span>{item.title}</span>

                            <div className={styles.infoSubContent}>
                            <span className={styles.temp}>{item.subText1} </span>
                            <span className={styles.weatherIcon}>{item.subText2}</span>
                            </div>
                        </div>
                  )
            })}
               </div>
            <div className={styles.feedContainer}>
                {feedItems.map((item) => (
                    <div key={item.id} className={styles.feedCard}>
                        <div className={styles.cardBody}>
                            <img src={item.imageSrc} alt="Content thumbnail" className={styles.thumbnail} />
                            <p className={styles.cardTitle}>{item.title}</p>
                        </div>
                    </div>
                ))}

           
            </div>
            <nav className={styles.bottomNav}>
                    <button className={`${styles.navButton} ${styles.active}`}>
                        <img src={Home} alt="Home" />
                    </button>
                    <button className={styles.navButton}>
                        <img src={Clock} alt="Home" />
                    </button>
                    <button className={styles.navButton}>
                        <img src={Bell} alt="Home" />
                    </button>
                    <button className={styles.navButton}>
                        <img src={Menu} alt="Home" />
                    </button>
                </nav>
        </div>
    );
};

export default GoogleFeed;