type ZoneConfig = {
  slug: string;
  name: string;
  type: ZoneVariant;
  superZone?: string;
  triggerSkip: boolean;
};

type SiteConfig = {
  name: string;
  slug: string;
  zones: Record<string, zoneConfig>;
  zoneOrder: ZoneConfig["slug"][];
  schedule: ScheduleItem[];
  providers: Provider[];
  rooms: string[];
};
