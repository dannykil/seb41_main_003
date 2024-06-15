import FeedItem from '../components/MainSection/FeedItem';
import styles from '../pages/FeedList.module.css';
import { MdSearch, MdFilterList } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';
import FilterDropdown from '../components/MainSection/FilterDropdown';
import { Link } from 'react-router-dom';
import { ButtonTop } from '../components/Button';
import MenuButtons from '../components/MainSection/FilterButton';
import axios from 'axios';
import useScroll from '../util/useScroll';
import LoadingIndicator from '../components/LoadingIndicator';
import Loading from '../components/Loading';
import useOutSideRef from '../util/useOutSideRef';

const TutorList = () => {
  const [tutorData, setTutorData] = useState();
  const [pageInfo, setPageInfo] = useState({
    page: 1,
  });

  //정렬 메뉴 오픈 상태
  const menuRef = useRef(null);
  const [dropdownRef, isOpen, setIsOpen] = useOutSideRef(menuRef);
  //과목 필터 메뉴에서 선택한 과목들
  const [subjectMenu, setSubjectMenu] = useState([]);
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [sort, setSort] = useState('');

  const loadingRef = useRef(null);

  const [isLoading, setIsLoading] = useScroll(() => {
    if (pageInfo.page < pageInfo.totalPages - 1) {
      setTimeout(() => {
        scrollFunc(pageInfo.page + 1);
        setIsLoading(false);
      }, 500);
    } else setIsLoading(false);
  }, loadingRef);

  const scrollFunc = async (page) => {
    await axios
      .get(
        `/users/tutors?subject=${subjectMenu.join()}&search=${search}&sort=${sort}&page=${page}`
      )
      .then(({ data }) => {
        setTutorData([...tutorData, ...data.data]);
        setPageInfo(data.pageInfo);
      })
      .catch((err) => console.error(err.message));
  };

  const getTutorData = async () => {
    await axios
      .get(
        `/users/tutors?subject=${subjectMenu.join()}&search=${search}&sort=${sort}`
      )
      .then(({ data }) => {
        setTutorData(data.data);
        setPageInfo(data.pageInfo);
      })
      .catch((err) => console.error(err.message));
  };

  const filterHandler = () => {
    setIsOpen(!isOpen);
  };

  const subjectHandler = (e) => {
    if (subjectMenu.includes(e.target.value)) {
      setSubjectMenu(subjectMenu.filter((el) => el !== e.target.value));
    } else {
      setSubjectMenu([e.target.value, ...subjectMenu]);
    }
  };

  const searchHandler = ({ type, key, target }) => {
    if (type === 'change') setSearchValue(target.value);
    else if (target.value === '') setSearch(searchValue);
    else if (type === 'keyup' && key === 'Enter') setSearch(searchValue);
  };

  useEffect(() => {
    getTutorData();
  }, [subjectMenu, search, sort]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.bannerContents}>
            <span className={styles.bannerText}>
              나에게 꼭 맞는 비대면 과외를 찾아보세요!
            </span>
            <div className={styles.searchBox}>
              <div className={styles.iconBox}>
                <MdSearch className={styles.mdSearch} />
              </div>
              <input
                className={styles.input}
                placeholder="서울대학교"
                value={searchValue}
                onChange={searchHandler}
                onKeyUp={searchHandler}
              ></input>
            </div>
          </div>
        </div>
        <div className={styles.menuContainer}>
          <MenuButtons
            subjectMenu={subjectMenu}
            subjectHandler={subjectHandler}
          />
          <button
            className={styles.filter}
            onClick={filterHandler}
            ref={menuRef}
          >
            <MdFilterList className={styles.mdFilterList} />
            <span>{sort === 'rate' ? '평점 순' : '최신 순'}</span>
            {isOpen ? (
              <FilterDropdown setFilter={setSort} ref={dropdownRef} />
            ) : null}
          </button>
        </div>
        <div className={styles.feedContainer}>
          {tutorData?.map((tutor) => (
            <Link
              to={`/tutorprofile`}
              state={{ profileId: tutor.profileId }}
              key={tutor.profileId}
              className={styles.list}
            >
              <FeedItem data={tutor} userStatus="TUTOR" />
            </Link>
          ))}
        </div>
        {tutorData?.length === 0 && (
          <div className={styles.notFound}>
            표시 할 튜터가 없습니다. 검색 조건을 확인하세요.
          </div>
        )}
        {tutorData === undefined && <Loading />}
        <LoadingIndicator ref={loadingRef} isLoading={isLoading} />
      </div>
      <ButtonTop />
    </div>
  );
};

export default TutorList;
