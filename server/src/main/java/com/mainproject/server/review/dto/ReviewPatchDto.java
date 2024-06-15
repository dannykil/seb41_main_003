package com.mainproject.server.review.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Getter
@Setter
@Builder
public class ReviewPatchDto {

    @Min(1) @Max(5)
    private int professional;

    @Min(1) @Max(5)
    private int readiness;

    @Min(1) @Max(5)
    private int explanation;

    @Min(1) @Max(5)
    private int punctuality;

    private String reviewBody;
}
