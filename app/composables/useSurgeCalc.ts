export const useSurgeCalc = () => {
  // HELPERS
  /**
   * Calculates percentage rounded to the nearest integer.
   * Returns 0 if total capacity is zero or invalid to prevent NaN.
   */
  function calculatePercentage(portion, total) {
    if (!total || total <= 0) return 0;
    const percentage = (portion / total) * 100;
    return Math.round(percentage);
  }

  // CONSTANTS
  // Maximum physical ED treatment spaces
  const MAX_PHYSICAL_CAPACITY = 40;

  // Base staffing ratio: 1 ED nurse can care for up to 5 standard ED patients
  const STANDARD_PATIENTS_PER_NURSE = 5;

  // Specific patient workload ratios
  const ICU_PATIENTS_PER_NURSE = 2;
  const CRITICAL_PATIENTS_PER_NURSE = 1;
  const ADMIT_PATIENTS_PER_NURSE = 5;

  // Convert non-standard patients into equivalent standard ED patient workload:
  // e.g., 1 Critical patient (1:1) takes the bandwidth of 5 standard ED patients (5:1).
  const ICU_WORKLOAD_MULTIPLIER =
    STANDARD_PATIENTS_PER_NURSE / ICU_PATIENTS_PER_NURSE;
  const CRITICAL_WORKLOAD_MULTIPLIER =
    STANDARD_PATIENTS_PER_NURSE / CRITICAL_PATIENTS_PER_NURSE;
  const ADMIT_WORKLOAD_MULTIPLIER =
    STANDARD_PATIENTS_PER_NURSE / ADMIT_PATIENTS_PER_NURSE;

  // INPUTS
  const state = useState('surge-calc-state', () => ({
    nurseCount: 0,
    standardEdPatients: 0,
    admitPatients: 0,
    icuPatients: 0,
    criticalPatients: 0
  }));

  function reset() {
    state.value = {
      nurseCount: 0,
      standardEdPatients: 0,
      admitPatients: 0,
      icuPatients: 0,
      criticalPatients: 0
    }
  }


  // CALCULATED VALUES
  // Staffed capacity constrained by physical treatment spaces
  const totalCapacity = computed(() => {
    const staffedCapacity = state.value.nurseCount * STANDARD_PATIENTS_PER_NURSE;
    return Math.min(staffedCapacity, MAX_PHYSICAL_CAPACITY);
  });

  // Convert all boarders/holds into equivalent standard ED patient workload units
  const holdEquivalentPatients = computed(() => {
    const criticalEquivalent =
      state.value.criticalPatients* CRITICAL_WORKLOAD_MULTIPLIER;
    const icuEquivalent = state.value.icuPatients * ICU_WORKLOAD_MULTIPLIER;
    const admitEquivalent = state.value.admitPatients * ADMIT_WORKLOAD_MULTIPLIER;

    return criticalEquivalent + icuEquivalent + admitEquivalent;
  });

  // Capacity remaining after accounting for holds and standard ED patients
  const remainingCapacity = computed(() => {
    return (
      totalCapacity.value -
      state.value.standardEdPatients -
      holdEquivalentPatients.value
    );
  });

  // Percentage utilization metrics
  const holdCapacityUsedPct = computed(() => {
    return calculatePercentage(
      holdEquivalentPatients.value,
      totalCapacity.value,
    );
  });

  const edPatientsUsedPct = computed(() => {
    return calculatePercentage(state.value.standardEdPatients, totalCapacity.value);
  });

  const capacityUsedPct = computed(() => {
    return calculatePercentage(
      holdEquivalentPatients.value + state.value.standardEdPatients,
      totalCapacity.value,
    );
  });

  const remainingCapacityPct = computed(() => {
    return calculatePercentage(remainingCapacity.value, totalCapacity.value);
  });

  // SURGE LEVELS
  const holdSurgeLevel = computed(() => {
    const pctUsed = holdCapacityUsedPct.value;
    if (pctUsed < 10) return "green";
    if (pctUsed < 20) return "yellow";
    if (pctUsed < 30) return "orange";
    if (pctUsed < 50) return "red";
    return "black";
  });

  const edSurgeLevel = computed(() => {
    const pctUsed = edPatientsUsedPct.value;
    if (pctUsed < 90) return "green";
    if (pctUsed < 100) return "yellow";
    if (pctUsed < 120) return "orange";
    if (pctUsed < 130) return "red";
    return "black";
  });

  return {
    state,
    totalCapacity,
    remainingCapacity,
    capacityUsedPct,
    holdCapacityUsedPct,
    holdSurgeLevel,
    edSurgeLevel,
    reset
  }

}
