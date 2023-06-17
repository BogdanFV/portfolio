import React from 'react';

import './App.scss';
import Profile from './components/Profile/Profile';


function App() {
  return (
    <div className="App">
      <div className="background-gears">
        <div className="gear gear-1" />
        <div className="gear gear-2" />
        <div className="gear gear-3" />
        <div className="gear gear-4" />
      </div>
      <header className="App-header">
        <Profile />
      </header>
    </div>
  );
}

export default App;
