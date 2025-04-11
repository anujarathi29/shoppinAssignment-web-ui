import React from 'react';
import SearchBar from './common-components/SearchBar';
import HeaderBar from './common-components/HeaderBar';
import './Home.css';
import GoogleFeed from './common-components/GoogleFeed';

const Home = () => {
  return (
<div className="home-container">
  <div className="center-block">
    <HeaderBar />
    <div className="g-text">Google</div>
    <SearchBar />
    <GoogleFeed/>
  </div>
</div>
  );
}


export default Home;