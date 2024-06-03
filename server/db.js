import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "http://localhost:54321",
  process.env.SUPABASE_API
);

export default {
  async getSiteDetails(site_id) {
    try {
      const { data: details, error: detailsError } = await supabase
        .from("sites")
        .select("id, name, zones(*), shift_types(*), clinicians(*)")
        .eq("id", site_id)
        .limit(1)
        .single()
        .order("site_order", { referencedTable: "zones" })
        .order("lname", { referencedTable: "clinicians" });
      if (detailsError) throw detailsError;
      return details;
    } catch (error) {
      console.error(error);
    }
  },

  async getShifts(site_id) {
    try {
      const { data: shifts, error: shiftError } = await supabase
        .from("shifts")
        .select(
          `*,
          clinician:clinician_id(*, clinician_type:clinician_type_id(*)), 
          details:shift_type_id(name, start, end),
          patients:patients!shift_id(*),
          supervised_patients:patients!supervisor_shift_id(*)`
        )
        .eq("site_id", site_id)
        .order("zone_id", { ascending: true })
        .order("zone_order", { ascending: true });
      if (shiftError) throw shiftError;
      return shifts;
    } catch (error) {
      console.error(error);
    }
  },

  async getEvents(site_id) {
    try {
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select(
          `*, 
        shift:shift_id(*, clinician:clinician_id(*)), 
        patient:patient_id(*)`
        )
        .eq("site_id", site_id)
        .order("created_at", { ascending: false });
      if (eventsError) throw eventsError;
      return events;
    } catch (error) {
      console.error(error);
    }
  },
};
