import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define Status Type
type StatusType = "operational" | "degraded" | "partial" | "major" | "maintenance";
type MonitorStatus = "paused" | "pending" | "maintenance" | "up" | "validating" | "down";

type Monitor = {
  id: string;
  attributes: {
    url: string;
    pronounceable_name: string;
    status: MonitorStatus;
  };
};

// Status Map
const STATUS_MAP: Record<StatusType, { status: string; label: string }> = {
  operational: { status: "operational", label: "服务正常" },
  degraded: { status: "degraded", label: "性能下降" },
  partial: { status: "partial", label: "部分问题" },
  major: { status: "major", label: "重大事故" },
  maintenance: { status: "maintenance", label: "正在检修" },
};

const parseFilterList = (value?: string) =>
  value
    ?.split(",")
    .map(item => item.trim())
    .filter(Boolean) || [];

const normalizeUrl = (url: string) => url.replace(/\/$/, "").toLowerCase();

const filterMonitors = (monitors: Monitor[]) => {
  const ids = parseFilterList(process.env.BETTER_STACK_STATUS_MONITOR_IDS);
  const urls = parseFilterList(process.env.BETTER_STACK_STATUS_MONITOR_URLS).map(normalizeUrl);
  const names = parseFilterList(process.env.BETTER_STACK_STATUS_MONITOR_NAMES);

  const filtered = monitors.filter(monitor => {
    if (ids.length > 0 && ids.includes(monitor.id)) return true;
    if (urls.length > 0 && urls.includes(normalizeUrl(monitor.attributes.url))) return true;
    if (names.length > 0 && names.includes(monitor.attributes.pronounceable_name)) return true;
    return ids.length === 0 && urls.length === 0 && names.length === 0;
  });

  return filtered.filter(monitor => !["paused", "pending"].includes(monitor.attributes.status));
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiToken = process.env.BETTER_STACK_API_TOKEN;

  // Use Vercel's caching
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

  if (!apiToken) {
    return res.status(200).json({
      status: "unknown",
      label: "未配置状态",
      updatedAt: null,
    });
  }

  try {
    const response = await fetch("https://uptime.betterstack.com/api/v2/monitors", {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
        throw new Error(`Better Stack API error: ${response.statusText}`);
    }

    const data = await response.json() as { data: Monitor[] };

    const monitors = filterMonitors(data.data || []);
    const totalCount = monitors.length;
    const downCount = monitors.filter(m => m.attributes.status === "down").length;
    const maintenanceCount = monitors.filter(m => m.attributes.status === "maintenance").length;
    const validatingCount = monitors.filter(m => m.attributes.status === "validating").length;
    const upCount = monitors.filter(m => m.attributes.status === "up").length;

    let statusType: StatusType;

    if (totalCount === 0) {
      const hasFilter = Boolean(
        process.env.BETTER_STACK_STATUS_MONITOR_IDS ||
        process.env.BETTER_STACK_STATUS_MONITOR_URLS ||
        process.env.BETTER_STACK_STATUS_MONITOR_NAMES,
      );

      return res.status(200).json({
        status: "unknown",
        label: hasFilter ? "无匹配监控项" : "无监控项",
        updatedAt: new Date().toISOString(),
      });
    }

    if (downCount > totalCount / 2) {
      statusType = "major";
    } else if (downCount > 0) {
      statusType = "partial";
    } else if (maintenanceCount > 0) {
      statusType = "maintenance";
    } else if (validatingCount > 0) {
      statusType = "degraded";
    } else if (upCount === totalCount) {
      statusType = "operational";
    } else {
      statusType = "partial";
    }

    const statusInfo = STATUS_MAP[statusType];

    return res.status(200).json({
      status: statusInfo.status,
      label: statusInfo.label,
      updatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Fetch status failed:", error);
    return res.status(200).json({
      status: "error",
      label: "无法获取状态",
      updatedAt: null,
    });
  }
}
