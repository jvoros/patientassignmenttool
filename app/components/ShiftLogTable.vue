<script setup lang="ts">
export type ShiftRow = {
    shift: string;
    days: number;
    avgTotal: number;
    sdTotal: number;
    avgAssigned: number;
    sdAssigned: number;
    avgSupervised: number;
    sdSupervised: number;
    triageDaysPct: number;
    avgTriagedActive: number;
};

withDefaults(
    defineProps<{
        title: string;
        rows: ShiftRow[];
        showTotal?: boolean;
        showSupervised?: boolean;
        showTriaged?: boolean;
    }>(),
    {
        showTotal: true,
        showSupervised: true,
        showTriaged: false,
    },
);
</script>

<template>
    <div>
        <h2 class="text-lg font-semibold mb-2">{{ title }}</h2>
        <div v-if="rows.length" class="overflow-x-auto">
            <table class="w-full text-sm text-left border-collapse mb-14">
                <thead>
                    <tr class="border-b border-default text-muted">
                        <th class="py-2 pr-4 font-medium">Shift</th>
                        <th class="py-2 px-3 font-medium text-right">Count</th>
                        <template v-if="showTotal">
                            <th class="py-2 px-3 font-medium text-right">
                                Avg Total
                            </th>
                            <th class="py-2 px-3 font-medium text-right">
                                ±SD
                            </th>
                        </template>
                        <th class="py-2 px-3 font-medium text-right">
                            Avg Assigned
                        </th>
                        <th class="py-2 px-3 font-medium text-right">±SD</th>
                        <template v-if="showSupervised">
                            <th class="py-2 px-3 font-medium text-right">
                                Avg Supervised
                            </th>
                            <th class="py-2 px-3 font-medium text-right">
                                ±SD
                            </th>
                        </template>
                        <template v-if="showTriaged">
                            <th class="py-2 px-3 font-medium text-right">
                                Triage Days
                            </th>
                            <th class="py-2 px-3 font-medium text-right">
                                Avg When Active
                            </th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="row in rows"
                        :key="row.shift"
                        class="border-b border-default/50 hover:bg-elevated/50 transition-colors"
                    >
                        <td class="py-2 pr-4">{{ row.shift }}</td>
                        <td class="py-2 px-3 text-right text-muted">
                            {{ row.days }}
                        </td>
                        <template v-if="showTotal">
                            <td class="py-2 px-3 text-right font-medium">
                                {{ row.avgTotal }}
                            </td>
                            <td class="py-2 px-3 text-right text-muted">
                                {{ row.sdTotal }}
                            </td>
                        </template>
                        <td class="py-2 px-3 text-right font-medium">
                            {{ row.avgAssigned }}
                        </td>
                        <td class="py-2 px-3 text-right text-muted">
                            {{ row.sdAssigned }}
                        </td>
                        <template v-if="showSupervised">
                            <td class="py-2 px-3 text-right font-medium">
                                {{ row.avgSupervised }}
                            </td>
                            <td class="py-2 px-3 text-right text-muted">
                                {{ row.sdSupervised }}
                            </td>
                        </template>
                        <template v-if="showTriaged">
                            <td class="py-2 px-3 text-right font-medium">
                                {{ row.triageDaysPct }}%
                            </td>
                            <td class="py-2 px-3 text-right font-medium">
                                {{
                                    row.triageDaysPct > 0
                                        ? row.avgTriagedActive
                                        : "—"
                                }}
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else class="text-muted text-sm">No data in this range.</p>
    </div>
</template>
