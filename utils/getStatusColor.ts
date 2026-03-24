export function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-(--accent-green)";
    case "in_progress":
    case "active":
      return "bg-(--accent-cyan)";
    case "cancelled":
      return "bg-(--accent-red)";
    case "on_hold":
    case "paused":
      return "bg-(--accent-amber)";
    case "not_started":
    case "archived":
      return "bg-(--accent-slate)";
    default:
      return "bg-(--accent-purple)";
  }
}

export function getStatusTextColor(status: string) {
  switch (status) {
    case "completed":
      return "primary-green";
    case "in_progress":
    case "active":
      return "primary-cyan";
    case "cancelled":
      return "primary-red";
    case "on_hold":
    case "paused":
      return "primary-amber";
    case "not_started":
    case "archived":
      return "primary-slate";
    default:
      return "primary-purple";
  }
}
