import service from "../request";
import {
  type BaseLog,
  type BaseLogService,
  type PageBaseLogRequest,
  type PageBaseLogResponse,
} from "@/rpc/admin/base_log";
import type { Int64Value } from "@/rpc/google/protobuf/wrappers";

const BASE_LOG_URL = "/admin/base/log";

/** Admin系统日志服务 */
export class BaseLogServiceImpl implements BaseLogService {
  /** 查询系统日志分页列表 */
  PageBaseLog(request: PageBaseLogRequest): Promise<PageBaseLogResponse> {
    return service<PageBaseLogResponse>({
      url: `${BASE_LOG_URL}`,
      method: "get",
      params: request,
    });
  }
  /** 查询系统日志 */
  GetBaseLog(request: Int64Value): Promise<BaseLog> {
    return service<BaseLog>({
      url: `${BASE_LOG_URL}/${request.value}`,
      method: "get",
    });
  }
}

export const defBaseLogService = new BaseLogServiceImpl();
