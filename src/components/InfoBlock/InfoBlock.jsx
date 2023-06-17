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
    <>
      <div className="info-cover">
        <div>Богдан Фарсиев</div>
        <div>{age} года</div>
        <div>Frontend разработчик</div>
      </div>
    </>
  );
};

export default InfoBlock;
