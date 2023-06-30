import React from 'react';
import './InfoBlock.scss';


const InfoBlock = () => {

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const birthDate = '2000-01-19';
  const age = calculateAge(birthDate);

  return (
    <div className='info-block'>
      <div className="name-cover">
        <div>Богдан Фарсиев</div>
        <div>{age} года</div>
        <div>Frontend разработчик</div>
      </div>
      <span className='info-skills__headline'>Рабочий стек </span>
      <div className='info-skills__block'>
        <p className='info-text'><span>Языки программирования:</span> TS, JS, ES6</p>

        <p className='info-text'><span>Фреймворки:</span> React, React Native, Vue 2, Vue 3</p>
        <p className='info-text'><span>Препроцессоры:</span> Sass, Less</p>
        <p className='info-text'><span>Инструменты сборки:</span> Webpack</p>
      </div>
    </div>
  );
};

export default InfoBlock;
