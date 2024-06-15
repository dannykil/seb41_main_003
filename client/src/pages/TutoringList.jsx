import styles from './TutoringList.module.css';
import axios from 'axios';
import Tutoring from '../components/TutoringList/Tutoring';
import { useState, useEffect } from 'react';
import Pagination from '../util/Pagination';
import { useRecoilValue } from 'recoil';
import Profile from '../recoil/profile';
import Loading from '../components/Loading';

const TutoringList = () => {
  const [tutorings, setTutorings] = useState([0]);
  const [pageInfo, setPageInfo] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [page, setPage] = useState(0);
  const { profileId } = useRecoilValue(Profile);

  const filterHandler = (e) => {
    const { name } = e.target;
    if (name === 'current') setIsFinished(false);
    else setIsFinished(true);
  };

  const getTutoringList = async () => {
    setTutorings([0]);
    await axios
      .get(
        `/tutoring/${profileId}?get=${
          isFinished ? 'FINISH' : 'PROGRESS'
        }&page=${page}`
      )
      .then((res) => {
        setTutorings(res.data.data);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTutoringList();
  }, [page, isFinished]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2>과외 리스트</h2>
        <div className={styles.filter}>
          <button
            name="current"
            onClick={filterHandler}
            className={isFinished ? '' : `${styles.active}`}
          >
            진행 중인 과외
          </button>
          <span>&nbsp;|&nbsp;</span>
          <button
            name="finished"
            onClick={filterHandler}
            className={isFinished ? `${styles.active}` : ''}
          >
            종료된 과외
          </button>
        </div>
        <ul className={styles.tutoringList}>
          {tutorings[0] !== 0 ? (
            tutorings.map((tutoring) => (
              <Tutoring tutoring={tutoring} key={tutoring.tutoringId} />
            ))
          ) : (
            <Loading />
          )}
        </ul>
        {tutorings.length === 0 && (
          <div className={styles.noContent}>
            <p>
              아직 {isFinished === false ? '진행중인' : '종료된'} 과외가
              없습니다.
            </p>
          </div>
        )}
        <div className={styles.pageNation}>
          <Pagination pageInfo={pageInfo} setPage={setPage} />
        </div>
      </div>
    </div>
  );
};

export default TutoringList;
