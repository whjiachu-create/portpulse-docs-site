---
id: insomnia
title: Insomnia
sidebar_position: 3
---

Use PortPulse API with **Insomnia**. This page is P1-ready: copy‑pasteable, no MDX expressions, and consistent with our auth model.

## Prerequisites

- **Insomnia** (Core or Designer): [Download](https://insomnia.rest/download)
- **API base**: `https://api.useportpulse.com`
- **Demo key for docs**: `dev_demo_123`  
  （上线前请替换为客户的正式 key；仅用于演示。）

## 1) 导入 OpenAPI

> 推荐通过 URL 导入，后续可一键刷新。

**方式 A：URL 导入（推荐）**
1. 打开 Insomnia → `Create` → **Request Collection**（或选择现有 Workspace）。
2. 右上角 `Import` → **From URL**。
3. 粘贴：`https://docs.useportpulse.com/openapi` → `Import`.

**方式 B：本地文件导入**
1. 在浏览器打开 `https://docs.useportpulse.com/openapi` 并保存为 `openapi.json`。
2. Insomnia → `Import` → **From File** → 选择刚保存的 `openapi.json`。

导入后，你会看到基于分组的接口列表（如 **Health**, **Ports**, **Schedules**, **Errors** 等）。

## 2) 配置环境变量（Environment）

1. 在左侧集合上右键 → **Environment** → **Manage Environments**。
2. 新建或编辑 **Base Environment**，填入：

```json
{
  "baseUrl": "https://api.useportpulse.com",
  "apiKey": "dev_demo_123"
}
```

> 说明：`baseUrl` 与 `apiKey` 仅为变量名，后续请求可用 `{{ baseUrl }}` / `{{ apiKey }}` 引用。

## 3) 设置集合级默认请求头（可继承）

1. 选中集合根节点（或特定文件夹）→ `Settings` → **Headers**。
2. 添加两条默认 Header（子请求将自动继承，可被单个请求覆盖）：

```
X-API-Key: {{ apiKey }}
Accept: application/json
```

> 我们只使用 `X-API-Key`，**不**使用 `Authorization: Bearer …`。

## 4) 一键健康检查（验证 Key 与连通性）

导入的集合中应包含 `GET /v1/health`。如果没有，可新建 **GET** 请求并设置：

- **URL**：`{{ baseUrl }}/v1/health`
- **Headers**：自动继承（或手动补齐上面的两条）

点击 **Send**，应返回 **200 OK** 且一个简短 JSON。若是 **401/403**，通常是没带 `X-API-Key` 或 key 无效。

## 5) 示例：查询端点（示意）

以下仅示意；具体参数与响应以左侧各端点说明为准（详见「**Endpoints**」与「**API Reference**」）。

**GET 端点示例**
- **URL**：`{{ baseUrl }}/v1/ports?limit=5&amp;country=CN`  
- **Headers**：继承或同上

期望 **200 OK**，返回 JSON 列表。若分页/过滤，请依据接口文档中的参数说明设置。

## 常见问题（Troubleshooting）

- **401/403**：确认已在集合或请求级 Header 添加 `X-API-Key: {{ apiKey }}`；确认 key 未过期、未输入多余空格。
- **404**：检查所选环境 `baseUrl` 是否为 `https://api.useportpulse.com`，以及接口路径是否与文档一致。
- **网络问题/代理**：公司网络可能要求代理或双因素认证；可尝试禁用系统级代理/切换网络后再发起请求。
- **OpenAPI 导入失败**：确保导入的是 `https://docs.useportpulse.com/openapi`（最新版），或改用文件导入。

## 相关文档

- 认证方式与示例：**[Authentication](/docs/getting-started/authentication)**
- Postman 用法：**[Postman](/docs/postman)**
- 速率限制：**[Rate limits](/docs/guides/rate-limits)**
- 错误码：**[Errors](/docs/guides/errors)**
- 端点一览：**[Endpoints](/docs/endpoints)**、**[API Reference / Endpoints](/docs/api-reference/endpoints)**

---

**安全提示**  
演示 key `dev_demo_123` 仅用于文档示例。客户上线必须使用其专属生产 key，并妥善保管。
