package com.ecomerce.ptit.dto.user;
import lombok.*;


@Getter
@Setter
public class UserAddressResponse {
    private AddressDTO address;
    private boolean isDefault;
}
