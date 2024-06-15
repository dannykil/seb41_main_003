import styles from './Tutoring.module.css';
import { Link } from 'react-router-dom';
import PropType from 'prop-types';

const Tutoring = ({ tutoring }) => {
  const {
    tutoringId,
    tutorName,
    tuteeName,
    tutoringTitle,
    tutoringStatus,
    createAt,
    updateAt,
  } = tutoring;

  const userStatus = sessionStorage.getItem('userStatus');

  return (
    <li
      className={`${styles.tutoring} ${
        (tutoringStatus === 'FINISH' || tutoringStatus.includes('DELETE')) &&
        styles.finish
      }`}
    >
      <Link to="/tutoring" state={{ tutoringId }}>
        <div>
          <h4>
            <span className={styles.name}>
              {sessionStorage.getItem('userStatus') === 'TUTOR'
                ? tuteeName
                : tutorName}
              <span className={styles.bar}>|</span>
            </span>
            <span className={styles.title}>
              {tutoringTitle.length >= 21
                ? `${tutoringTitle.slice(0, 21)} ...`
                : tutoringTitle}
            </span>
          </h4>
          {createAt === '' ? undefined : (
            <span>
              {new Date(createAt).toLocaleDateString()} ~{' '}
              {tutoringStatus === 'FINISH' &&
                new Date(updateAt).toLocaleDateString()}
            </span>
          )}
          {tutoringStatus === 'UNCHECK' && userStatus === 'TUTEE' && (
            <span className={styles.noti} />
          )}
        </div>
      </Link>
    </li>
  );
};

Tutoring.propTypes = {
  tutoring: PropType.object,
};

export default Tutoring;
