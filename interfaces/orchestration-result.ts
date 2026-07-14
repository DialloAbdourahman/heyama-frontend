import { EnumStatusResponse } from "@/enums/status-response";
import { EnumStatusCode } from "@/enums/response-status-code";

export interface IOrchestrationResult<T> {
  code: EnumStatusResponse;
  statusCode: EnumStatusCode;
  message: string;
  data: T;
}
