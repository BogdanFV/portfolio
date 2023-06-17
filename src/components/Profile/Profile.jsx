import React from 'react';
import './Profile.scss';

import AvatarMain from '../AvatarMain/AvatarMain';
import InfoBlock from '../InfoBlock/InfoBlock';

const Profile = () => {
  return (
    <div className="page-cover">
      <AvatarMain />
      <InfoBlock />
    </div>
  );
};

export default Profile;
