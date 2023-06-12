import React from 'react';
import './Profile.scss';

const Profile = ({ children }) => {
  return (
    <div className="profile-cover">
      {children}
    </div>
  );
};

export default Profile;
