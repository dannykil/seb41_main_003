package com.mainproject.server.tutoring.repository.custom;

import com.mainproject.server.constant.ErrorCode;
import com.mainproject.server.constant.ProfileStatus;
import com.mainproject.server.constant.TutoringStatus;
import com.mainproject.server.dateNotice.entity.QDateNotice;
import com.mainproject.server.dateNotice.entity.QHomework;
import com.mainproject.server.dateNotice.entity.QNotice;
import com.mainproject.server.dateNotice.entity.QSchedule;
import com.mainproject.server.exception.ServiceLogicException;
import com.mainproject.server.profile.entity.QProfile;
import com.mainproject.server.tutoring.dto.TutoringQueryDto;
import com.mainproject.server.tutoring.entity.QTutoring;
import com.mainproject.server.tutoring.entity.Tutoring;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;
import java.util.Optional;

public class CustomTutoringRepositoryImpl
        extends QuerydslRepositorySupport implements CustomTutoringRepository {

    public CustomTutoringRepositoryImpl() {
        super(Tutoring.class);
    }

    @Override
    public Page<TutoringQueryDto> findQueryTutoring(
            Long profileId,
            TutoringStatus status,
            Pageable pageable
    ) {

        ProfileStatus profileStatus = getProfileStatus(profileId);

        QTutoring tutoring = QTutoring.tutoring;
        JPQLQuery<TutoringQueryDto> query = from(tutoring)
                .select(
                        Projections.constructor(
                                TutoringQueryDto.class,
                                tutoring.tutoringId,
                                tutoring.tutor.name,
                                tutoring.tutee.name,
                                tutoring.tutoringTitle,
                                tutoring.tutoringStatus,
                                tutoring.createAt,
                                tutoring.updateAt
                        )
                );

        if (profileId != null) {
            query.where(
                    tutoring.tutor.profileId.eq(profileId)
                            .or(tutoring.tutee.profileId.eq(profileId))
            );
        }
        if (profileStatus.equals(ProfileStatus.TUTOR)) {
            if (status.equals(TutoringStatus.FINISH)) {
                query.where(
                        tutoring.tutoringStatus.eq(TutoringStatus.TUTEE_DELETE)
                                .or(tutoring.tutoringStatus.eq(TutoringStatus.FINISH))
                );
            } else {
                query.where(
                        tutoring.tutoringStatus.eq(TutoringStatus.PROGRESS)
                                .or(tutoring.tutoringStatus.eq(TutoringStatus.UNCHECK))
                                .or(tutoring.tutoringStatus.eq(TutoringStatus.WAIT_FINISH))
                );
            }
        } else {
            if (status.equals(TutoringStatus.FINISH)) {
                query.where(
                        tutoring.tutoringStatus.eq(TutoringStatus.TUTOR_DELETE)
                                .or(tutoring.tutoringStatus.eq(TutoringStatus.FINISH))
                );
            } else {
                query.where(
                        tutoring.tutoringStatus.eq(TutoringStatus.PROGRESS)
                                .or(tutoring.tutoringStatus.eq(TutoringStatus.UNCHECK))
                                .or(tutoring.tutoringStatus.eq(TutoringStatus.WAIT_FINISH))
                );
            }
        }
        List<TutoringQueryDto> tutoringList = Optional.ofNullable(getQuerydsl())
                .orElseThrow(() -> new ServiceLogicException(
                        ErrorCode.DATA_ACCESS_ERROR))
                .applyPagination(pageable, query)
                .fetch();
        return new PageImpl<>(tutoringList, pageable, query.fetchCount());
    }

    @Override
    public Tutoring findTutoringById(Long tutoringId) {
        QTutoring tutoring = QTutoring.tutoring;
        QProfile profile = QProfile.profile;
        QDateNotice dateNotice = QDateNotice.dateNotice;
        QNotice notice = QNotice.notice;
        QSchedule schedule = QSchedule.schedule;
        QHomework homework = QHomework.homework;
        JPQLQuery<Tutoring> query = from(tutoring)
                .leftJoin(tutoring.tutor, profile)
                .fetchJoin()
                .leftJoin(tutoring.tutee, profile)
                .fetchJoin()
                .leftJoin(tutoring.dateNotices, dateNotice)
                .fetchJoin()
                .leftJoin(dateNotice.homeworks, homework)
                .fetchJoin()
                .leftJoin(dateNotice.notice, notice)
                .fetchJoin()
                .leftJoin(dateNotice.schedule, schedule)
                .fetchJoin()
                .distinct();
        if (tutoringId != null) {
            query.where(tutoring.tutoringId.eq(tutoringId));
        }
        return Optional.ofNullable(query.fetchOne())
                .orElseThrow(() -> new ServiceLogicException(ErrorCode.NOT_FOUND));
    }

    private ProfileStatus getProfileStatus(Long profileId) {
        QProfile profile = QProfile.profile;
        return Optional.ofNullable(
                        from(profile)
                                .select(profile.profileStatus)
                                .where(profile.profileId.eq(profileId))
                                .fetchFirst())
                .orElseThrow(() -> new ServiceLogicException(ErrorCode.PROFILE_NOT_FOUND));
    }
}
