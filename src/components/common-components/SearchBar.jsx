import React from 'react';
import styled from 'styled-components';
import googleLensIcon from '../../assets/G_lens.svg';
import googleMic from '../../assets/G_mic.svg';
import searchIcon from '../../assets/search.svg';

const Bar = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border-radius: 50px;
  background-color : #2f3133; 
  height : 30px;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  pointer-events: none;
  opacity: 0.6;
`;

const Input = styled.input`
  padding: 0.4rem 0.4rem 0.4rem 2rem; /* Add left padding for the icon */
  border: none;
  border-radius: 50px;
  background-color: #2f3133;
  color: white;
  outline: none;
  height: 30px;
`;
export default function SearchBar({ onSearch, onMicClick, onCameraClick }) {
  return (
    <Bar>
      {/* <Input type="text" placeholder="Search..." onChange={e => onSearch(e.target.value)} /> */}
      <InputWrapper>
    <SearchIcon src={searchIcon} alt="search" />
    <Input type="text" placeholder="Search" onChange={e => onSearch(e.target.value)} />
  </InputWrapper>
      <button onClick={onMicClick} style={{background:"transparent", border:"none"}}>
        <img src={googleMic} style={{height:"30px", width:"30px"}}/>
      </button>
      <button onClick={onCameraClick} style={{background:"transparent", border:"none"}}>
        <img src={googleLensIcon} style={{height:"30px", width:"30px"}}/>
      </button>
    </Bar>
  );
}