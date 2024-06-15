import styles from './GlobalModal.module.css';
import { useResetRecoilState, useRecoilValue } from 'recoil';
import ModalState from '../../recoil/modal.js';
import {
  AlertModal,
  ConfirmModal,
  ConfirmTextModal,
  ConfirmValiModal,
  RedConfirmModal,
  RedAlertModal,
} from './DefaultModal.jsx';
import { RedConfirmValiModal, RedHandlerAlertModal } from './RedModals';
import AdminModal from './AdminModal';
import BothHandlerModal from './BothHandlerModal';
import ReviewModal from './ReviewModal';
import ReviewDetailModal from './ReviewDetail';
import EditReviewModal from './EditReviewModal';
import ImgLoadModal from './ImgLoadModal';
import HandlerAlertModal from './HandlerAlertModal';

export const GlobalModal = () => {
  const reset = useResetRecoilState(ModalState);
  const { isOpen, modalType, props, backDropHandle } =
    useRecoilValue(ModalState);
  if (!isOpen) return;

  const modal = {
    alert: <AlertModal {...props} />,
    confirm: <ConfirmModal {...props} />,
    confirmVali: <ConfirmValiModal {...props} />,
    confirmText: <ConfirmTextModal {...props} />,
    admin: <AdminModal />,
    bothHandler: <BothHandlerModal {...props} />,
    review: <ReviewModal {...props} />,
    reviewDetail: <ReviewDetailModal {...props} />,
    editReview: <EditReviewModal {...props} />,
    imgLoad: <ImgLoadModal {...props} />,
    redConfirm: <RedConfirmModal {...props} />,
    redAlert: <RedAlertModal {...props} />,
    handlerAlert: <HandlerAlertModal {...props} />,
    redConfirmVali: <RedConfirmValiModal {...props} />,
    redHandlerAlert: <RedHandlerAlertModal {...props} />,
  };

  return (
    <div
      className={styles.backdrop}
      {...(!backDropHandle && {
        onClick: () => reset(),
      })}
      aria-hidden="true"
    >
      {modal[modalType]}
    </div>
  );
};
