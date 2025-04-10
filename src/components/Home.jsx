import React from 'react';
import SearchBar from './common-components/SearchBar';
import HeaderBar from './common-components/HeaderBar';
import './Home.css';

const Home = () => {
  return (
<div className="home-container">
  <div className="center-block">
    <HeaderBar />
    <div className="g-text">Google</div>
    <SearchBar />
  </div>
</div>
  );
}


export default Home;