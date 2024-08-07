package com.ecomerce.ptit.repository;

import com.ecomerce.ptit.model.Product;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


import java.util.List;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findAllByCategoryId(Long id);
    List<Product> findAllByActiveIsTrueOrderByRatingDescSoldDesc(Pageable pageable);
    List<Product> findAllByCategory_IdAndActiveTrueOrderByRatingDescSoldDesc(Long category_id, Pageable pageable);
    @Override
    List<Product> findAll(Specification<Product> specification, Sort sort);
}
