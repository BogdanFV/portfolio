import React from 'react';
import './Profile.scss';

import AvatarMain from '../AvatarMain/AvatarMain';
import InfoBlock from '../InfoBlock/InfoBlock';

const Profile = () => {
  return (
    <div className="page-cover">
      <div className='page-decoration page-decoration-1'></div>
      <div className='page-decoration page-decoration-2'></div>
      <div className='page-decoration page-decoration-3'></div>
      <div className='page-decoration page-decoration-4'></div>
      <AvatarMain />
      <InfoBlock />
    </div>
  );
};

export default Profile;
