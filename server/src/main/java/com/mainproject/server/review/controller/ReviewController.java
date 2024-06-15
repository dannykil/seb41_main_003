package com.mainproject.server.review.controller;

import com.mainproject.server.dto.ResponseDto;
import com.mainproject.server.review.dto.ReviewPatchDto;
import com.mainproject.server.review.dto.ReviewPostDto;
import com.mainproject.server.review.entity.Review;
import com.mainproject.server.review.mapper.ReviewMapper;
import com.mainproject.server.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/reviews")
public class ReviewController {
    private final ReviewMapper mapper;
    private final ReviewService reviewService;

    @GetMapping("/{reviewId}")
    public ResponseEntity getReview(
            @PathVariable("reviewId") Long reviewId
    ) {
        Review review = reviewService.getReview(reviewId);
        return new ResponseEntity(
                ResponseDto.of(mapper.reviewToReviewResponseDto(review)),
                HttpStatus.OK);
    }

    @PostMapping("/{tutoringId}")
    public ResponseEntity postReview(
            @PathVariable("tutoringId") Long tutoringId,
            @RequestBody @Valid ReviewPostDto reviewPostDto
    ) {
        Review review = reviewService.createReview(
                mapper.reviewPostDtoToReview(reviewPostDto),
                tutoringId);
        return new ResponseEntity(
                ResponseDto.of(mapper.reviewToReviewResponseDto(review)),
                HttpStatus.CREATED);
    }

    @PatchMapping("/{tutoringId}")
    public ResponseEntity patchReview(
            @PathVariable("tutoringId") Long tutoringId,
            @RequestBody ReviewPatchDto reviewPatchDto
    ) {
        Review review = reviewService
                .updateReview(
                        mapper.reviewPatchDtoToReview(reviewPatchDto),
                        tutoringId
                );

        return new ResponseEntity(
                ResponseDto.of(mapper.reviewToReviewResponseDto(review)),
                HttpStatus.OK);
    }
}
