package com.mainproject.server.dateNotice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@ToString
public class DateNoticePostDto {

    @NotBlank
    private String dateNoticeTitle;

    @NotBlank
    private String startTime;

    @NotBlank
    private String endTime;

    @NotBlank
    private String scheduleBody;

    @NotNull
    private String noticeBody;

    private List<HomeworkPostDto> homeworks;

}
