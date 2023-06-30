import React from 'react';
import './Profile.scss';

import AvatarMain from '../AvatarMain/AvatarMain';
import PageLeftDecoration from '../PageDecoration/PageLeftDecoration';
import ContentBlock from '../ContentBlock/ContentBlock';


const Profile = () => {
  return (
    <div className='test-cover'>
      <div className="page-cover">
        <PageLeftDecoration />
        <AvatarMain />
      </div>
        <ContentBlock />
    </div>
  );
};

export default Profile;
