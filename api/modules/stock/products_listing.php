<?php
############	Start: Products Listing ############
$app->post('/stock/products-listing/get-inventory-global-data', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getInventoryGlobalData($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-inventory-setup-global-data', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getInventorySetupGlobalData($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_products_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/item-details-price-qty', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->itemDetailsPriceQty($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-categories', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getCategories($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/item-popup', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->item_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-item-unit-of-measure', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getItemUnitOfMeasure($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/item-list-with-bucket-popup', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->itemListWithBucketPopup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-product-by-id', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_product_by_id($input_array['product_id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/chk-for-brand', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->chkForBrand($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/add-product', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_product($input_array);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/update-product', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->update_product($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/delete-product', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->delete_product($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-finished-goods-info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->getFinishedGoodsInfo($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/insert-raw-material-item', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_raw_material_item($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/delete-raw-material-item', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->delete_raw_material_item($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

// 

$app->post('/stock/get-products-listing-warehouse-allocated', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_product_listing_warehouse_allocate($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-delete-product-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_delete_products_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/add-delete-product-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_delete_product($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/delete-del-single', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->delete_update_status('product_delete_link', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-substitute-product-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_substitute_products_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/get-sel-substitute-product-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_sel_substitute_products_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/add-substitute-product-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_substitute_product($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/stock/products-listing/delete-substitute-single', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->delete_update_status('product_substitute_link', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


/* $app->post('/stock/products-listing/add-invoice', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->update_invoice($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
}); */

// update Receipt Date for allocations in PO
$app->post('/stock/products-listing/update-receipt-date-chk', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->updateReceiptDateChk($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-item-purchase-info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getItemPurchaseInfo($input_array['product_id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/* item purchase cost */
$app->post('/stock/products-listing/get-product-purchase-cost', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getProductPurchaseCost($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/delete-product-purchase-cost', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->deleteProductPurchaseCost($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
/* item purchase cost end*/

$app->post('/stock/products-listing/get-recomended-purchase-price', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getRecomendedPurchasePrice($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-recomended-purchase-price2', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getRecomendedPurchasePriceWithUOM($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-product-uom', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getProductUOM($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/add-item-purchase-Info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->addItemPurchaseInfo($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/stock/products-listing/get-item-sales-info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getItemsalesInfo($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/add-item-sales-Info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->addItemSalesInfo($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-supplier-prices-for-item', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_supplier_prices_for_item($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/delete-item-price-offer', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->deleteItemPriceOffer($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/add-product-price-volume', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->addItemPriceOfferVolume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/stock/products-listing/delete-product-price-volume', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->deleteItemPriceOfferVolume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/stock/products-listing/get-item-marginal-analysis', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->getItemMarginalAnalysis($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/stock/products-listing/add-item-marginal-analysis', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->addItemMarginalAnalysis($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/stock/products-listing/delete-item-marginal-analysis', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->deleteItemMarginalAnalysis($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/stock/products-listing/get-code', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->getCode($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});

$app->post('/stock/products-listing/get-unique-id', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_unique_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});
$app->post('/stock/products-listing/get-products-popup', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_products_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-products-setup-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_products_setup_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-sales-products-popup', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_sales_products_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-products-popup-invoice', function () use ($app) {
    global $objStock, $input;
    $array = array(
        "all" => 1,
        "category_id" => $input->category_id,
        "search_string" => $input->search_string,
        "start" => $input->start,
        "limit" => $input->limit,
        "keyword" => $input->keyword
    );
    $result = $objStock->get_products_popup_invoice($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-purchased-products-popup', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_purchased_products_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/item_detail_by_id', function () use ($app) {
    global $objStock, $input;
    $array = array(
        "product_id" => $input->product_id
    );
    $result = $objStock->get_product_details_by_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/products', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_products($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/get-purchase-products-popup', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_purchase_products_popup($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

/*    Sales Price Start   */

$app->post('/stock/products-listing/purchase-info-listing', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_purchase_info_listing($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/add-purchase-info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->add_purchase_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/stock/products-listing/update-purchase-info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->update_purchase_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-purchase-info-by-id', function () use ($app) {
    global $objStock, $input;
    $input_array = array(
        "id" => $input->id
    );
    $result = $objStock->get_purchase_info_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/delete-purchase-info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->delete_update_status('product_supplier', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-customer-supplier-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();

    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_customer_supplier_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/add-purchase-info-volume', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->add_purchase_info_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
$app->post('/stock/products-listing/update-purchase-info-volume', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->update_purchase_info_volume($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


/*    Sales Price End     */
$app->post('/stock/products-listing/add-product-detail', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_product_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/get-product-detail-by-id', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_product_detail_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/get-sale-promotion-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_sales_promotion_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/add-sale-promotion', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_sales_promotion($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-sale-promotion-by-id', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_data_by_id('product_sale_promotion', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});


$app->post('/stock/products-listing/update-sale-promotion', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->update_sales_promotion($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/delete-sale-promotion', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->delete_update_status('product_sale', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/get-product-standard-volume-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_product_standard_volume_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/get-product-standard-volume-by-id', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_product_standard_volume_by_id($input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/add-product-standard-volume-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_product_standard_volume_list_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/delete-product-standard-volume-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->delete_update_status('product_volume_discount', 'status', $input_array['id']);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/purchase_list', function () use ($app) {
    global $objStock, $input;
    $array = array(
        "product_id" => $input->product_id
    );

    $result = $objStock->get_purchase_list_product_id($array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});


$app->post('/stock/product-listing/purchase_by_id', function () use ($app) {
    global $objStock, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objStock->get_data_by_id('product_purchaser', $array['id']);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});


$app->post('/stock/products-listing/purchase_delete_id', function () use ($app) {
    global $objStock, $input;
    $array = array(
        "id" => $input->id
    );
    $result = $objStock->delete_update_status('product_purchaser', 'status', $array['id']);

    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);

});


$app->post('/stock/products-listing/get-last-po-date', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_last_po_date($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/get-status-history', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_history_status($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});



$app->post('/stock/products-listing/get-item-avg-so', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_item_avg_overall_so($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-item-avg-overall-po', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }

    $result = $objStock->get_item_avg_overall_po($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-item-avg-purchase-info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_item_avg_purchase_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/check-purchase-uom-onchange', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->check_purchase_uom_onchange($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/change-standard-purchase-info', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->change_standard_purhcase_info($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


############	 Stock Sheet ##############

$app->post('/stock/products-listing/get-product-listing', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->getAllProductsList($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-product-listing-for-sel', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->getAllProductsListforSel($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-stock-sheet-listing', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->getStockSheetList($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-product-stock-sheet', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_product_stock_sheet($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


// $app->post('/stock/products-listing/stock-sheet', function () use ($app) {
//     global $objStock, $input;
//     $input_array = array();
//     foreach ($input as $key => $val) {
//         $input_array[$key] = $val;
//     }
//     $result = $objStock->stock_sheet($input_array);
//     $app->response->setStatus(200);
//     $app->response()->headers->set('Content-Type', 'application/json');
//     echo json_encode($result);
// });

$app->post('/stock/products-listing/stock-sheet', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->stock_sheet($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/stock-sheet-available', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->stockSheetAvailable($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/stock-sheet-onRoute', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->stockSheetOnRoute($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/stock-sheet-allocated', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->stockSheetAllocated($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


############ purchase-cost-detail-list start ##############


$app->post('/stock/products-listing/get-purchase-cost-detail-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_purchase_cost_detail_list($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-purchase-cost-detail-total', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_purchase_cost_detail_total($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/get-purchase-cost-detail-byid', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_purchase_cost_detail_byid($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/add-purchase-cost-detail', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->add_purchase_cost_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/edit-purchase-cost-detail', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->edit_purchase_cost_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/del-purchase-cost-detail', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->del_purchase_cost_detail($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});


$app->post('/stock/products-listing/get-warehouse-uom-by-id', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->get_item_warehouse_uom_by_id($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

############ purchase-cost-detail-list end ##############


// Accounts Activity Module Start
//----------------------------------------
/* 
$app->post('/stock/products-listing/account-activity', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->account_activity($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});
 */
// Accounts Activity Module End
//----------------------------------------


$app->post('/stock/products-listing/get-add-cost-list', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->getAddCostList($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

$app->post('/stock/products-listing/put-template-data', function () use ($app) {
    global $objStock, $input;
    $input_array = array();
    foreach ($input as $key => $val) {
        $input_array[$key] = $val;
    }
    $result = $objStock->putTemplateData($input_array);
    $app->response->setStatus(200);
    $app->response()->headers->set('Content-Type', 'application/json');
    echo json_encode($result);
});

?>