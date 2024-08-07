package com.ecomerce.ptit.mapper;

import com.ecomerce.ptit.dto.review.ReviewResponseForProduct;
import com.ecomerce.ptit.dto.review.ReviewResponseForUser;
import com.ecomerce.ptit.model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "userEmail")
    @Mapping(source = "orderItem.id", target = "orderItemId")
    @Mapping(source = "product.name", target = "productName")
    ReviewResponseForUser toReviewResponseForUser(Review review);
    List<ReviewResponseForUser> toReviewResponseForUsers(List<Review> reviews);

    ReviewResponseForProduct toReviewResponseForProduct(ReviewResponseForUser reviewResponseForUser);
    List<ReviewResponseForProduct> toReviewResponseForProducts(List<ReviewResponseForUser> reviewResponseForUsers);
}
