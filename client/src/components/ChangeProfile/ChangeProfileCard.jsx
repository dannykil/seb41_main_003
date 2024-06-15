import { LabelTextInput } from '../Input';
import { ButtonNightBlue } from '../Button';
import styles from './ChangeProfileCard.module.css';
import { MdMode } from 'react-icons/md';
import PropType from 'prop-types';
import SubjectsButtons from './SubjectsButtons';
import ModalState from '../../recoil/modal.js';
import { useSetRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import defaultUser from '../../assets/defaultUser.png';
import Profile from '../../recoil/profile';
import validation from '../../util/validation';

const ChangeProfileCard = ({ isNew = true, user, setUser }) => {
  const { name, bio, school, subjects, profileImage } = user;
  const userStatus = sessionStorage.getItem('userStatus');
  const [imgFile, setImgFile] = useState({});
  const [imgSrc, setImgSrc] = useState();
  const navigate = useNavigate();

  const profileId = useLocation().state?.profileId;

  const setModal = useSetRecoilState(ModalState);
  const resetModal = useResetRecoilState(ModalState);
  const setProfile = useSetRecoilState(Profile);

  const profile = useRecoilValue(Profile);

  const requiredProps = {
    isOpen: true,
    modalType: 'alert',
    props: { text: '필수 입력 사항을 모두 작성해주세요.' },
  };

  const patchImg = async (id) => {
    const formData = new FormData();
    formData.append('image', imgFile);

    await axios
      .patch(`/upload/profile-image/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        const profileImage = data.data[0];

        if (profile.profileId === profileId) {
          setProfile((prev) => ({
            ...prev,
            url: profileImage.url,
          }));
        }
      })
      .catch((err) => console.log(err));
  };

  const patchProfile = async () => {
    await axios
      .patch(`/profiles/details/${profileId}`, {
        ...user,
      })
      .then(({ data }) => {
        if (profile.profileId === profileId)
          setProfile((prev) => ({
            ...prev,
            name: data.data.name,
          }));
        if (imgSrc) patchImg(data.data.profileId);
      })
      .catch((err) => console.log(err));
  };

  const editHandler = () => {
    patchProfile();
    resetModal();
    setTimeout(() => {
      navigate(profile.profileId === profileId ? '/myprofile' : '/admin');
    }, 500);
  };

  const postProfile = async () => {
    await axios
      .post(`/profiles/${sessionStorage.getItem('userId')}`, {
        ...user,
      })
      .then(({ data }) => {
        if (imgSrc) patchImg(data.data.profileId);
        localStorage.removeItem('addProfile');
      })
      .catch((err) => console.log(err));
  };

  const addHandler = () => {
    postProfile();
    resetModal();
    setTimeout(() => {
      navigate(`/admin`);
    }, 500);
  };

  const editConfirmProps = {
    isOpen: true,
    modalType: 'confirm',
    props: {
      text: `현재 입력된 내용으로
    프로필을 수정하시겠습니까?`,
      modalHandler: editHandler,
    },
  };

  const addConfirmProps = {
    isOpen: true,
    modalType: 'confirm',
    props: {
      text: `현재 입력된 내용으로
    프로필을 추가하시겠습니까?`,
      modalHandler: addHandler,
    },
  };

  const subjectTitles = subjects.map((obj) => obj.subjectTitle);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const { way, gender, pay, wantDate } = user;
    if (
      !(
        way &&
        gender &&
        pay &&
        wantDate &&
        subjects.length !== 0 &&
        validation(name, 'name')
      )
    ) {
      setModal(requiredProps);
    } else {
      isNew ? setModal(addConfirmProps) : setModal(editConfirmProps);
    }
  };

  const imgModalProps = {
    isOpen: true,
    modalType: 'imgLoad',
    props: { setImgFile, setImgSrc },
  };

  return (
    <div>
      <form id="profile" onSubmit={(e) => submitHandler(e)}>
        <div className={styles.container}>
          <div className={styles.userImage}>
            <div className={styles.imgContain}>
              <img
                src={imgSrc || profileImage?.url || defaultUser}
                alt="profile-img"
              />
              <button type="button" onClick={() => setModal(imgModalProps)}>
                <MdMode />
              </button>
            </div>
          </div>
          <div>
            <span className={styles.required}>
              <span className={styles.requiredIcon} />은 필수 입력 사항입니다.
            </span>

            <div className={styles.userInfo}>
              <div className={styles.inputContain}>
                <LabelTextInput
                  id="name"
                  name="이름"
                  placeHolder="이름"
                  type="text"
                  value={name}
                  handler={inputHandler}
                  required
                />
                <span className={styles.vali}>
                  {!validation(name, 'name') &&
                    `이름은 한글 2~6자, 영어 4~12글자까지 쓸 수 있습니다.`}
                </span>
              </div>
              <div className={styles.inputContain}>
                <LabelTextInput
                  id="bio"
                  name="한 줄 소개"
                  placeHolder="한 줄 소개"
                  type="text"
                  value={bio}
                  handler={inputHandler}
                  required
                />
                <span className={styles.desc}>본인을 간단히 표현해보세요.</span>
              </div>

              <div className={styles.inputContain}>
                <LabelTextInput
                  id="school"
                  name={userStatus === 'TUTOR' ? '학교 / 학번' : '학년'}
                  placeHolder={userStatus === 'TUTOR' ? '학교 / 학번' : '학년'}
                  type="text"
                  value={school}
                  handler={inputHandler}
                  required
                />
                <span className={styles.desc}>
                  {userStatus === 'TUTOR'
                    ? 'ex. 한국대학교 16학번 졸업'
                    : 'ex. 고등학교 2학년'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.subject}>
            과목
            <span className={styles.requiredIcon} />
            <SubjectsButtons subjectTitles={subjectTitles} setUser={setUser} />
          </div>

          {isNew ? (
            <div className={styles.buttonBox}>
              <ButtonNightBlue text="추가완료" form="profile" type="submit" />
            </div>
          ) : (
            <div className={styles.buttonBox}>
              <ButtonNightBlue text="수정완료" form="profile" type="submit" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

ChangeProfileCard.propTypes = {
  isNew: PropType.bool,
  user: PropType.object,
  setUser: PropType.func,
};

export default ChangeProfileCard;
