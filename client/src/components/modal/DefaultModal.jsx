import styles from './DefaultModal.module.css';
import PropTypes from 'prop-types';
import { ButtonNightBlue, ButtonSilver, ButtonRed } from '../Button';
import { TextInput } from '../Input';
import { useState, useRef, useEffect } from 'react';
import { useResetRecoilState } from 'recoil';
import ModalState from '../../recoil/modal.js';

export const AlertModal = ({ text }) => {
  const reset = useResetRecoilState(ModalState);
  return (
    <div
      className={styles.view}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-hidden
    >
      <div className={styles.text}>{text}</div>
      <ButtonNightBlue buttonHandler={() => reset()} text="확인" />
    </div>
  );
};

AlertModal.propTypes = {
  text: PropTypes.string,
  modalHandler: PropTypes.func,
};

export const ConfirmModal = ({ text, modalHandler }) => {
  const reset = useResetRecoilState(ModalState);
  return (
    <div
      className={styles.view}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-hidden
    >
      <div className={styles.text}>{text}</div>
      <div className={styles.buttonBox}>
        <ButtonNightBlue name="yes" buttonHandler={modalHandler} text="확인" />
        <ButtonSilver name="no" buttonHandler={() => reset()} text="취소" />
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  text: PropTypes.string,
  modalHandler: PropTypes.func,
};

export const ConfirmValiModal = ({ text, modalHandler, validation }) => {
  const reset = useResetRecoilState(ModalState);
  const [value, setValue] = useState('');

  const validationHandler = (e) => {
    e.preventDefault();
    if (value === validation) modalHandler(e);
  };

  const textInput = useRef(null);

  useEffect(() => {
    textInput.current.focus();
  }, []);

  return (
    <form
      className={styles.view}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-hidden
    >
      <div className={styles.text}>{text}</div>
      <div className={styles.input}>
        <TextInput
          id="confirmInput"
          placeHolder={validation}
          value={value}
          handler={(e) => setValue(e.target.value)}
          ref={textInput}
        />
        <span>
          {value !== validation && `${validation}를(을) 정확히 입력해주세요.`}
        </span>
      </div>
      <div className={styles.buttonBox}>
        <ButtonNightBlue
          name="yes"
          buttonHandler={validationHandler}
          text="확인"
        />
        <ButtonSilver name="no" buttonHandler={() => reset()} text="취소" />
      </div>
    </form>
  );
};

ConfirmValiModal.propTypes = {
  text: PropTypes.string,
  modalHandler: PropTypes.func,
  validation: PropTypes.string,
};

export const ConfirmTextModal = ({
  text,
  modalHandler,
  placeHolder,
  inputType = 'text',
}) => {
  const reset = useResetRecoilState(ModalState);
  const [value, setValue] = useState('');

  const valueHandler = (e) => {
    setValue(e.target.value);
  };

  const textInput = useRef(null);

  useEffect(() => {
    textInput.current.focus();
  }, []);

  return (
    <form
      className={styles.view}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-hidden
    >
      <div className={styles.text}>{text}</div>
      <div className={styles.input}>
        <TextInput
          id="confirmInput"
          type={inputType}
          placeHolder={placeHolder}
          value={value}
          handler={valueHandler}
          ref={textInput}
        />
      </div>
      <div className={styles.buttonBox}>
        <ButtonNightBlue
          name="yes"
          buttonHandler={(e) => {
            modalHandler(e, value);
          }}
          text="확인"
        />
        <ButtonSilver name="no" buttonHandler={() => reset()} text="취소" />
      </div>
    </form>
  );
};

ConfirmTextModal.propTypes = {
  text: PropTypes.string,
  modalHandler: PropTypes.func,
  placeHolder: PropTypes.string,
  inputType: PropTypes.string,
};

export const RedConfirmModal = ({ text, modalHandler }) => {
  const reset = useResetRecoilState(ModalState);
  return (
    <div
      className={styles.view}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-hidden
    >
      <div className={styles.text}>{text}</div>
      <div className={styles.buttonBox}>
        <ButtonRed name="yes" buttonHandler={modalHandler} text="확인" />
        <ButtonSilver name="no" buttonHandler={() => reset()} text="취소" />
      </div>
    </div>
  );
};

RedConfirmModal.propTypes = {
  text: PropTypes.string,
  modalHandler: PropTypes.func,
};

export const RedAlertModal = ({ text, modalHandler }) => {
  const reset = useResetRecoilState(ModalState);
  return (
    <div
      className={styles.view}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-hidden
    >
      <div className={styles.text}>{text}</div>
      <ButtonRed
        buttonHandler={modalHandler ? modalHandler : () => reset()}
        text="확인"
      />
    </div>
  );
};

RedAlertModal.propTypes = {
  text: PropTypes.string,
  modalHandler: PropTypes.func,
};
