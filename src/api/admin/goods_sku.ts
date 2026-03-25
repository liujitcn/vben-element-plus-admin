import service from "../request";
import {
  type GoodsSku,
  type GoodsSkuService,
  type PageGoodsSkuRequest,
  type PageGoodsSkuResponse,
} from "@/rpc/admin/goods_sku";
import type { Empty } from "@/rpc/google/protobuf/empty";
import type { Int64Value } from "@/rpc/google/protobuf/wrappers";

const GOODS_SKU_URL = "/admin/goods/sku";

/** Admin商品SKU服务 */
export class GoodsSkuServiceImpl implements GoodsSkuService {
  /** 查询sku分页列表 */
  PageGoodsSku(request: PageGoodsSkuRequest): Promise<PageGoodsSkuResponse> {
    return service<PageGoodsSkuResponse>({
      url: `${GOODS_SKU_URL}`,
      method: "get",
      params: request,
    });
  }
  /** 查询sku */
  GetGoodsSku(request: Int64Value): Promise<GoodsSku> {
    return service<GoodsSku>({
      url: `${GOODS_SKU_URL}/${request.value}`,
      method: "get",
    });
  }
  /** 更新sku */
  UpdateGoodsSku(request: GoodsSku): Promise<Empty> {
    return service<Empty>({
      url: `${GOODS_SKU_URL}/${request.id}`,
      method: "put",
      data: request,
    });
  }
}

export const defGoodsSkuService = new GoodsSkuServiceImpl();
