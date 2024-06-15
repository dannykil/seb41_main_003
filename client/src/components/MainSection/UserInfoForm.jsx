import styles from './UserInfoForm.module.css';
import { LabelTextInput, TextInput } from '../Input';
import { useState, useEffect } from 'react';
import { ButtonNightBlue, ButtonRed } from '../Button';
import axios from 'axios';
import { useSetRecoilState, useResetRecoilState } from 'recoil';
import validation from '../../util/validation';
import ModalState from '../../recoil/modal';
import Profile from '../../recoil/profile';
import { useNavigate } from 'react-router-dom';

const initialUserInfo = {
  nickName: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phoneNumber: '',
  userStatus: 'NONE',
  secondPassword: '',
  secondPasswordConfirm: '',
};

const UserInfoForm = () => {
  const [userData, setUserData] = useState(initialUserInfo);
  const [userStatus, setUserStatus] = useState('');
  const [confirmPassword, setConfirmPassword] = useState({
    pw: false,
    secondPw: false,
  });
  const setModal = useSetRecoilState(ModalState);
  const resetModal = useResetRecoilState(ModalState);
  const resetProfile = useResetRecoilState(Profile);
  const setProfile = useSetRecoilState(Profile);
  const navigate = useNavigate();
  const isNewUser = userData.userStatus === 'NONE';

  const conflictProp = {
    isOpen: true,
    modalType: 'alert',
    props: {
      text: `이미 등록된 휴대폰 번호입니다.`,
    },
  };

  const confirmProp = {
    isOpen: true,
    modalType: 'confirm',
    props: {
      text: `회원 정보를 수정하시겠습니까?`,
      modalHandler: () => {
        patchUserInfo();
      },
    },
  };

  const submitProp = {
    isOpen: true,
    modalType: 'alert',
    props: {
      text: `수정이 완료되었습니다.`,
    },
  };

  const confirmQuit = {
    isOpen: true,
    modalType: 'redConfirmVali',
    props: {
      text: '회원 탈퇴를 원하신다면 \n 아래의 입력창에 "회원 탈퇴" 를 입력 후 \n 확인 버튼을 눌러주세요.',
      validation: '회원 탈퇴',
      modalHandler: () => {
        setModal(alertQuit);
        deleteUserInfo();
      },
    },
  };

  const alertQuit = {
    isOpen: true,
    modalType: 'redHandlerAlert',
    props: {
      text: `회원 탈퇴가 완료되었습니다.`,
      modalHandler: () => {
        resetModal();
        navigate('/');
      },
    },
  };

  const getUserInfo = async () => {
    axios
      .get(`/users/${sessionStorage.getItem('userId')}`)
      .then(({ data }) => {
        const { email, nickName, userStatus, phoneNumber } = data.data;
        setUserData({
          ...userData,
          email,
          nickName,
          userStatus,
          phoneNumber: phoneNumber === null ? '' : phoneNumber,
        });
        setUserStatus(userStatus);
        sessionStorage.setItem('userStatus', userStatus);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const inputHandler = (e) => {
    const { id, value } = e.target;
    setUserData({ ...userData, [id]: value });
  };

  const radioHandler = (e) => {
    setUserStatus(e.target.value);
    sessionStorage.setItem('userStatus', e.target.value);
  };

  //* 비밀번호와 비밀번호 확인 체크하는 핸들러 함수
  const confirmHandler = () => {
    if (userData.password === userData.passwordConfirm) {
      setConfirmPassword((prev) => ({ ...prev, pw: true }));
    } else {
      setConfirmPassword((prev) => ({ ...prev, pw: false }));
    }
    if (userData.secondPasswordConfirm === userData.secondPassword) {
      setConfirmPassword((prev) => ({ ...prev, secondPw: true }));
    } else {
      setConfirmPassword((prev) => ({ ...prev, secondPw: false }));
    }
  };

  //* 비밀번호 확인용 핸들러
  useEffect(() => {
    confirmHandler();
  }, [userData.passwordConfirm, userData.password]);
  useEffect(() => {
    confirmHandler();
  }, [userData.secondPasswordConfirm, userData.secondPassword]);

  //* 확인 모달창을 띄우는 submit 핸들러
  const submitHandler = async (e) => {
    e.preventDefault();

    if (isNewUser) {
      if (
        validation(userData.nickName, 'name') &&
        (userData.password.length === 0 ||
          validation(userData.password, 'password')) &&
        validation(userData.phoneNumber, 'phoneNumber') &&
        validation(userData.secondPassword, 'secondPassword') &&
        userStatus !== 'NONE' &&
        confirmPassword.pw &&
        confirmPassword.secondPw
      ) {
        setModal(confirmProp);
      }
    } else {
      if (
        validation(userData.nickName, 'name') &&
        (userData.password.length === 0 ||
          validation(userData.password, 'password')) &&
        validation(userData.phoneNumber, 'phoneNumber') &&
        (userData.secondPassword.length === 0 ||
          validation(userData.secondPassword, 'secondPassword')) &&
        confirmPassword.pw &&
        confirmPassword.secondPw
      ) {
        setModal(confirmProp);
      } else {
        setModal({
          isOpen: true,
          modalType: 'alert',
          props: {
            text: `필수 항목을 입력해주세요.`,
          },
        });
      }
    }
  };

  const patchUserInfo = async () => {
    const { nickName, password, secondPassword, phoneNumber } = userData;

    const patchData = {
      nickName,
      ...(userData.password !== '' ? { password } : {}),
      ...(userData.secondPassword !== '' ? { secondPassword } : {}),
      phoneNumber: phoneNumber.replaceAll('-', ''),
      userStatus,
    };

    await axios
      .patch(
        `/users/${
          sessionStorage.getItem('userId') || localStorage.getItem('userId')
        }`,
        patchData
      )
      .then(({ data: { data } }) => {
        setModal(submitProp);
        setProfile((prev) => ({ ...prev, userStatus: data.userState }));
        sessionStorage.setItem('userStatus', data.userStatus);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 409) {
          setModal(conflictProp);
        }
      });
  };

  //회원탈퇴 API
  const deleteUserInfo = async () => {
    await axios
      .delete(`/users/${sessionStorage.getItem('userId')}`)
      .then(() => {
        sessionStorage.clear();
        localStorage.clear();
        resetProfile();
      })
      .catch((err) => console.log(err));
  };

  return (
    <article className={styles.userInfoContainer}>
      <h2 className={styles.userInfoText}>회원 정보 수정</h2>
      <span className={styles.required}>
        <span className={styles.requiredIcon} />은 필수 입력 사항입니다.
      </span>
      <form
        id="editUserInfo"
        onSubmit={submitHandler}
        className={styles.inputArea}
      >
        <LabelTextInput
          id="nickName"
          name="닉네임"
          placeHolder="닉네임"
          type="text"
          value={userData.nickName}
          handler={inputHandler}
          required
        />
        <span className={styles.vali}>
          {!validation(userData.nickName, 'name') &&
            '닉네임은 한글 2~6자, 영어 4~12글자까지 사용할 수 있습니다.'}
        </span>

        <div className={styles.emailBox}>
          <span>이메일</span>
          <span>{userData.email}</span>
        </div>

        <LabelTextInput
          id="password"
          name="비밀번호 수정"
          placeHolder="비밀번호 수정"
          type="password"
          value={userData.password}
          handler={inputHandler}
        />
        <TextInput
          id="passwordConfirm"
          type="password"
          placeHolder="비밀번호 확인"
          value={userData.passwordConfirm}
          handler={inputHandler}
        />
        <span className={styles.vali}>
          {!validation(userData.password, 'password') &&
            '비밀번호는 영문/숫자 조합으로 8~16자리여야 합니다.'}
          {!confirmPassword.pw && validation(userData.password, 'password')
            ? '비밀번호 확인 입력이 잘못되었습니다.'
            : ''}
        </span>

        <LabelTextInput
          id="phoneNumber"
          name="휴대폰 번호"
          placeHolder="휴대폰 번호"
          type="tel"
          value={userData.phoneNumber}
          handler={inputHandler}
          required
        />
        <span className={styles.vali}>
          {!validation(userData.phoneNumber, 'phoneNumber') &&
            '올바른 휴대폰번호를 입력해주세요.'}
        </span>

        <div className={styles.userStatusBox}>
          <span className={styles.userType}>
            유저 타입
            <span className={styles.requiredIcon} />
          </span>
          <div className={styles.radioBox}>
            <label
              className={
                userStatus === 'TUTOR'
                  ? styles.checkedLabel
                  : styles.normalLabel
              }
            >
              <input
                type="radio"
                value="TUTOR"
                checked={userStatus === 'TUTOR'}
                onChange={radioHandler}
                className={styles.radioButton}
                {...(!isNewUser && {
                  disabled: 'disabled',
                })}
              />
              튜터
            </label>
            <label
              className={
                userStatus === 'TUTEE'
                  ? styles.checkedLabel
                  : styles.normalLabel
              }
            >
              <input
                type="radio"
                value="TUTEE"
                checked={userStatus === 'TUTEE'}
                onChange={radioHandler}
                className={styles.radioButton}
                {...(!isNewUser && {
                  disabled: 'disabled',
                })}
              />
              튜티
            </label>
          </div>
        </div>
        <span className={styles.vali}>
          유저 타입은 최초 1회 결정 후 수정할 수 없습니다.
        </span>

        <LabelTextInput
          id="secondPassword"
          name="2차 비밀번호"
          placeHolder="2차 비밀번호"
          type="password"
          value={userData.secondPassword}
          handler={inputHandler}
          {...(isNewUser && {
            required: true,
          })}
        />
        <TextInput
          id="secondPasswordConfirm"
          type="password"
          placeHolder="2차 비밀번호 확인"
          value={userData.secondPasswordConfirm}
          handler={inputHandler}
          {...(isNewUser && {
            required: true,
          })}
        />
        <span>2차 비밀번호는 프로필 관리에 사용됩니다.</span>
        <span className={styles.vali}>
          {!validation(userData.secondPassword, 'secondPassword') &&
            '2차 비밀번호는 4~8자리 숫자여야 합니다.'}
          {!confirmPassword.secondPw &&
          validation(userData.secondPassword, 'secondPassword')
            ? '비밀번호 확인 입력이 잘못되었습니다.'
            : ''}
        </span>
        <ButtonNightBlue text="수정 완료" form="editUserInfo" />
        <ButtonRed
          text="회원 탈퇴"
          buttonHandler={() => setModal(confirmQuit)}
        />
      </form>
    </article>
  );
};

export default UserInfoForm;
