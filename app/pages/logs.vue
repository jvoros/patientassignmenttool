<script setup lang="ts">
import type { ShiftRow } from "~/components/ShiftLogTable.vue";

type LogRow = {
    cal_date: string;
    shift: string;
    provider: string;
    assigned: number;
    supervised: number;
    triaged: number;
};

// Default to last 30 days
const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);

const toDateInput = (d: Date) => d.toISOString().slice(0, 10);
const startDate = ref(toDateInput(thirtyDaysAgo));
const endDate = ref(toDateInput(yesterday));

const logs = ref<LogRow[]>([]);
const loading = ref(false);
const error = ref("");

const fetchLogs = async () => {
    loading.value = true;
    error.value = "";
    try {
        const data = await $fetch("/api/logs", {
            query: { start: startDate.value, end: endDate.value },
        });
        logs.value = data.logs;
    } catch (e: any) {
        error.value = e?.data?.message ?? "Failed to load logs.";
    } finally {
        loading.value = false;
    }
};

onMounted(fetchLogs);
watch([startDate, endDate], fetchLogs);

const { config } = useBoard();

onMounted(async () => {
    if (!config.value) {
        const { session } = useUserSession();
        const slug = session.value?.user?.slug;
        if (slug) {
            const data = await $fetch(`/api/board/${slug}`);
            config.value = data.config;
        }
    }
});

const scheduleOrder = computed(
    () => config.value?.schedule.map((s) => s.name) ?? [],
);

// Parse YYYY-MM-DD as local date to avoid UTC shift when checking day of week
const isWeekend = (cal_date: string): boolean => {
    const [y, m, d] = cal_date.split("-").map(Number);
    const day = new Date(y!, m! - 1, d!).getDay();
    return day === 0 || day === 6;
};

const isApp = (shiftName: string) => /\bapp\b/i.test(shiftName);

const round1 = (n: number) => Math.round(n * 10) / 10;

const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

// Sample standard deviation (Bessel's correction)
const sd = (arr: number[]) => {
    if (arr.length < 2) return 0;
    const mean = avg(arr);
    const variance =
        arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (arr.length - 1);
    return Math.sqrt(variance);
};

const buildTableData = (rows: LogRow[]): ShiftRow[] => {
    if (!rows.length) return [];

    const byShift: Record<
        string,
        {
            assigned: number[];
            supervised: number[];
            triaged: number[];
        }
    > = {};

    for (const row of rows) {
        if (!byShift[row.shift])
            byShift[row.shift] = { assigned: [], supervised: [], triaged: [] };
        if (row.assigned > 0) {
            byShift[row.shift].assigned.push(row.assigned);
            byShift[row.shift].supervised.push(row.supervised);
            byShift[row.shift].triaged.push(row.triaged);
        }
    }

    return Object.keys(byShift)
        .sort((a, b) => {
            const ai = scheduleOrder.value.indexOf(a);
            const bi = scheduleOrder.value.indexOf(b);
            if (ai === -1 && bi === -1) return a.localeCompare(b);
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
        })
        .map((shift) => {
            const { assigned, supervised, triaged } = byShift[shift];
            const totals = assigned.map((a, i) => a + (supervised[i] ?? 0));
            const triagedActive = triaged.filter((t) => t > 0);
            const triageDaysPct =
                assigned.length > 0
                    ? Math.round((triagedActive.length / assigned.length) * 100)
                    : 0;
            return {
                shift,
                days: assigned.length,
                avgTotal: round1(avg(totals)),
                sdTotal: round1(sd(totals)),
                avgAssigned: round1(avg(assigned)),
                sdAssigned: round1(sd(assigned)),
                avgSupervised: round1(avg(supervised)),
                sdSupervised: round1(sd(supervised)),
                triageDaysPct,
                avgTriagedActive: round1(avg(triagedActive)),
            };
        })
        .filter((r) => r.days > 0);
};

const weekdayRows = computed(() =>
    buildTableData(logs.value.filter((r) => !isWeekend(r.cal_date))),
);
const weekendRows = computed(() =>
    buildTableData(logs.value.filter((r) => isWeekend(r.cal_date))),
);

const weekdayPhysRows = computed(() =>
    weekdayRows.value.filter((r) => !isApp(r.shift)),
);
const weekdayAppRows = computed(() =>
    weekdayRows.value.filter((r) => isApp(r.shift)),
);
const weekendPhysRows = computed(() =>
    weekendRows.value.filter((r) => !isApp(r.shift)),
);
const weekendAppRows = computed(() =>
    weekendRows.value.filter((r) => isApp(r.shift)),
);

const uniqueCalendarDates = (rows: LogRow[]) =>
    new Set(rows.map((r) => r.cal_date)).size;

const totalDays = computed(() => uniqueCalendarDates(logs.value));
const weekdayDays = computed(() =>
    uniqueCalendarDates(logs.value.filter((r) => !isWeekend(r.cal_date))),
);
const weekendDays = computed(() =>
    uniqueCalendarDates(logs.value.filter((r) => isWeekend(r.cal_date))),
);
</script>

<template>
    <AppHeader />
    <UMain>
        <UContainer class="py-6">
            <h1 class="text-2xl font-bold mb-4">Shift Logs</h1>

            <div class="flex flex-wrap gap-4 items-end mb-6">
                <UFormField label="Start date">
                    <UInput type="date" v-model="startDate" />
                </UFormField>
                <UFormField label="End date">
                    <UInput
                        type="date"
                        v-model="endDate"
                        :max="toDateInput(yesterday)"
                    />
                </UFormField>
                <UButton
                    @click="fetchLogs"
                    :loading="loading"
                    label="Refresh"
                    color="neutral"
                />
            </div>

            <UBadge v-if="error" color="error" :label="error" class="mb-4" />

            <div v-if="loading" class="text-muted text-sm">Loading...</div>

            <div v-else-if="!logs.length" class="text-muted text-sm">
                No log data found for this date range.
            </div>

            <div v-else class="flex flex-col gap-10">
                <p class="text-sm text-muted">
                    {{ totalDays }} day(s) — {{ weekdayDays }} weekday(s),
                    {{ weekendDays }} weekend day(s)
                </p>

                <div class="flex flex-col gap-6">
                    <ShiftLogTable
                        title="Weekdays — Physicians"
                        :rows="weekdayPhysRows"
                    />
                    <ShiftLogTable
                        title="Weekdays — APPs"
                        :rows="weekdayAppRows"
                        :show-total="false"
                        :show-supervised="false"
                        :show-triaged="true"
                    />
                </div>

                <div class="flex flex-col gap-6">
                    <ShiftLogTable
                        title="Weekends — Physicians"
                        :rows="weekendPhysRows"
                    />
                    <ShiftLogTable
                        title="Weekends — APPs"
                        :rows="weekendAppRows"
                        :show-total="false"
                        :show-supervised="false"
                        :show-triaged="true"
                    />
                </div>
            </div>
        </UContainer>
    </UMain>
    <AppFooter />
</template>
