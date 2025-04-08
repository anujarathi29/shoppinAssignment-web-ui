import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import SearchResult from './components/SerchResult'

function App() {

  return (
    <>
    {/* <SearchBar/> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' exact element={<Home/>} />
      <Route path='/search' element={<SearchResult/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
