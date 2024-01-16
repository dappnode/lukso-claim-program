export interface ProviderMessage {
  type: string;
  data: unknown;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface ConnectInfo {
  chainId: string;
}

export interface DepositData {
  amount: number;
  deposit_cli_version: string;
  deposit_data_root: string;
  deposit_message_root: string;
  fork_version: string;
  network_name: string;
  pubkey: string;
  signature: string;
  withdrawal_credentials: string;
}

export interface ReqStatus {
  status: "success" | "pending" | "error";
  message?: string;
}
