export interface McpServerConfig {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  toolCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface McpTool {
  name: string;
  description: string;
  serverName: string;
  inputSchema: Record<string, unknown>;
}
