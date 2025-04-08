import React from 'react';
import styled from 'styled-components';
import googleG from '../../assets/G_logo.svg';
import gLabs from '../../assets/G_labs.svg';
import gemini from '../../assets/gemini.svg';
import SignIn from './SignIn';

const Bar = styled.div`
  display: flex;
  flex-direction : row;
  align-items: center;
  justify-content : space-between;
  padding: 0.5rem;
  border-radius: 20px;
  height : 20px;
  margin : 20px;
`;

const InnerBar = styled.div`
display : flex;
flex-direction : row;
align-items: center;
justify-content: center;
padding : 0.3rem;
border-radius : 10px;
background-color: #2f3133;
`;

const DeepBar = styled.div`
display : flex;
flex-direction : row;
align-items: center;
justify-content: center;
padding : 0.3rem;
border-radius : 10px;
background-color: #1f2125;
`;

const SearchText = styled.span`
  color: #fff;
  font-size: 14px;
  font-family: 'Roboto', sans-serif; /* or any other font */
  font-weight: 500;
  margin-left: 0.5rem;
`;


const Icon = styled.img`
  height: 20px;
  width: 20px;
`;


const HeaderBar = () => {
  return (
    <>
    {/* icon */}
    
    <Bar>
    <Icon src={gLabs}/>
    <InnerBar>
        <DeepBar>
      <Icon src={googleG}/>
      <SearchText>Search</SearchText>
      </DeepBar>
      <Icon src={gemini} />
      </InnerBar>
      <SignIn/>
    </Bar>
    </>
  );
}

export default HeaderBar;