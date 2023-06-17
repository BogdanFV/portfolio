import React, { useState } from 'react';
import './AvatarMain.scss';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const avatar = require('./profile-pic.jpg');

const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success('Ссылка скопирована в буфер обмена');
    })
    .catch((error) => {
      console.error('Ошибка при копировании ссылки: ', error);
    });
};

const AvatarMain = () => {
  const [hearts, setHearts] = useState([]);
  const [heartsAmount, setHeartsAmount] = useState(0);
  const [isClicked, setIsClicked] = useState(false); // New state for tracking the click

  const handleCopyLink = () => {
    const linkText = '@bgdnvkm';
    copyToClipboard(linkText);
  };

  const handleLogoClick = () => {
    const smallerSide = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    const newHeart = {
      id: Date.now(),
      x: Math.random() * smallerSide,
      y: Math.random() * smallerSide,
    };
    setHearts((prevHearts) => [...prevHearts, newHeart]);
    setTimeout(() => {
      setHearts((prevHearts) =>
        prevHearts.filter((heart) => heart.id !== newHeart.id)
      );
    }, 1000);
  };

  const handleImageClick = () => {
    setHeartsAmount((prevAmount) => prevAmount + 1);
    setIsClicked(true); // Set isClicked to true on first click
  };

  return (
    <>
      <div className='profile-cover'>
        <div className='App-avatar' onClick={handleLogoClick}>
          <img src={avatar} alt='profile' onClick={handleImageClick} />
          {hearts.map((heart) => (
            <div key={heart.id} className='heart' style={{ top: heart.y, left: heart.x }} />
          ))}
          <p className={`amount ${isClicked ? '' : 'disabled'}`}>Счёт: {heartsAmount}</p>
        </div>
        <div>Мой <a className='link' href='https://github.com/BogdanFV' target='_blank' rel='noopener noreferrer'>GitHub</a></div>
        <div>Tg <span className='link' onClick={handleCopyLink}>@bgdnvkm</span></div>
      </div>

      <ToastContainer
        position='top-right'
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        className='toast-message'
      />
    </>
  );
};

export default AvatarMain;
