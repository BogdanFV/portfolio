import React from 'react';

import './App.scss';
import Profile from './components/Profile/Profile';


function App() {
  return (
    <div className="App">
      <main className="App-main">
        <Profile />
      </main>
      <div className="background-gears">
        <div className="gear gear-1" />
        <div className="gear gear-2" />
        <div className="gear gear-3" />
        <div className="gear gear-4" />
      </div>
    </div>
  );
}

export default App;
