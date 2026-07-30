export const modes = {
  walkin: {
    tool: "Walk In",
    slug: "walkin",
    icon: "fa7-solid:walking",
    style: "bg-amber-50 border-amber-400 text-amber-400",
  },
  ft: {
    tool: "Fast Track",
    slug: "ft",
    icon: "fa7-solid:bolt-lightning",
    style: "bg-green-200 border-green-500 text-green-500",
  },
  ambo: {
    tool: "Ambulance",
    slug: "ambo",
    icon: "fa7-solid:truck-medical",
    style: "bg-red-200 border-red-500 text-red-500",
  },
  police: {
    tool: "Police",
    slug: "police",
    icon: "fa7-solid:shield",
    style: "bg-blue-100 border-blue-400 text-blue-500",
  },
  heli: {
    tool: "Helicopter",
    slug: "heli",
    icon: "fa7-solid:helicopter",
    style: "bg-red-500 border-white text-white",
  },
};

export const timelineModes = {
  ...modes,
  info: { tool: "Information", slug: "info", icon: "fa7-solid:circle" },
};
