package com.ecomerce.ptit.dto.product;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProductItemResponse {
    private String variationColor;
    List<ProductItemDTOv3> listProductItem;
}
