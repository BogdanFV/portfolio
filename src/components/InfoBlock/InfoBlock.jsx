import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InfoBlock.scss';

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success('Ссылка скопирована в буфер обмена');
    })
    .catch((error) => {
      console.error('Ошибка при копировании ссылки: ', error);
    });
};

const InfoBlock = () => {
  const handleCopyLink = () => {
    const linkText = '@bgdnvkm';
    copyToClipboard(linkText);
  };

  return (
    <div className="info-cover">
      <div>Богдан Фарсиев</div>
      <div>23 года</div>
      <div>Frontend разработчик</div>
      <br />
      <span>Мой <a className='link' href="https://github.com/BogdanFV" target="_blank" rel="noopener noreferrer">GitHub</a></span>
      <br />
      <div>Tg <span className='link' onClick={handleCopyLink}>@bgdnvkm</span></div>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        className ='toast-message'
      />
    </div>
  );
};

export default InfoBlock;
