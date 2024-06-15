import ChangeProfileCard from '../components/ChangeProfile/ChangeProfileCard';
import ChangeProfileContents from '../components/ChangeProfile/ChangeProfileContents';
import styles from './ChangeProfile.module.css';
import { ButtonTop } from '../components/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const EditProfile = () => {
  const {
    state: { profileId },
  } = useLocation();
  const [profileData, setProfileData] = useState({
    profileId: 0,
    userId: 0,
    name: '',
    rate: 0,
    bio: '',
    wantDate: '',
    pay: '',
    way: '',
    profileStatus: '',
    wantedStatus: '',
    gender: '',
    preTutoring: '',
    difference: '',
    school: '',
    character: '',
    subjects: [],
    reviews: [],
    profileImage: { url: '' },
  });

  const getProfileData = async () => {
    await axios
      .get(`/profiles/details/${profileId}`)
      .then((res) => {
        setProfileData(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <ChangeProfileCard
          user={profileData}
          setUser={setProfileData}
          isNew={false}
        />
        <ChangeProfileContents user={profileData} setUser={setProfileData} />
      </div>
      <ButtonTop />
    </div>
  );
};

export default EditProfile;
