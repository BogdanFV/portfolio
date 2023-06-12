import React, { useState } from 'react';
import './AvatarMain.scss';
const avatar = require('./profile-pic.jpg');

const AvatarMain = () => {
  const [hearts, setHearts] = useState([]);
  const [heartsAmount, setHeartsAmount] = useState(0);

  const handleLogoClick = () => {
    const smallerSide = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    const newHeart = {
      id: Date.now(),
      x: Math.random() * smallerSide,
      y: Math.random() * smallerSide
    };
    setHearts(prevHearts => [...prevHearts, newHeart]);
    setTimeout(() => {
      setHearts(prevHearts => prevHearts.filter(heart => heart.id !== newHeart.id));
    }, 1000);
  };

  const handleImageClick = () => {
    setHeartsAmount(prevAmount => prevAmount + 1);
  };

  return (
      <div className="App-avatar" onClick={handleLogoClick}>
        <img src={avatar} alt="profile" onClick={handleImageClick} />
        {hearts.map(heart => (
          <div key={heart.id} className="heart" style={{ top: heart.y, left: heart.x }} />
        ))}
        <p className='amount'>Счёт: {heartsAmount}</p>
      </div>
  );
};

export default AvatarMain;
