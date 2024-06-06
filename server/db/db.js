import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "http://localhost:54321",
  process.env.SUPABASE_API
);

export default {
  // FETCH BOARD PARTS
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
      console.error("detailsError: ", error);
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
      console.error("shiftError: ", error);
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
      console.error("eventsError: ", error);
    }
  },

  // ADD SHIFT
  async addShift(clinicianId, shiftTypeId, zoneId, siteId) {
    try {
      // get current next_pt_shift_order
      const { data: zoneData, error: zoneError } = await supabase
        .from("zones")
        .select("shift:next_pt_shift_id(zone_order)")
        .eq("id", zoneId)
        .single();
      if (zoneError) throw zoneError;
      // get next shift order, else insert at 0
      const zoneOrder = zoneData.shift?.zone_order
        ? zoneData.shift.zone_order
        : 0;

      //add shift with that order
      const { data: newShift, error: newShiftError } = await supabase
        .from("shifts")
        .insert({
          shift_type_id: shiftTypeId,
          site_id: siteId,
          zone_id: zoneId,
          clinician_id: clinicianId,
          zone_order: zoneOrder,
        })
        .select();
      if (newShiftError) throw newShiftError;

      // update shift orders for zone

      // database function
      // CREATE OR REPLACE FUNCTION increment_order_in_zone(zone_id_param INT, order_in_zone_param INT, exclude_shift_id_param INT)
      // RETURNS VOID AS $$
      // BEGIN
      //     UPDATE shifts
      //     SET zone_order = zone_order + 1
      //     WHERE zone_id = zone_id_param
      //       AND zone_order >= zone_order_param
      //       AND id <> exclude_shift_id_param;
      // END;
      // $$ LANGUAGE plpgsql;

      const { error: updateError } = await supabase.rpc(
        "increment_order_in_zone",
        {
          zone_id_param: zoneId,
          order_in_zone_param: zoneOrder,
          exclude_shift_id_param: newShift[0].id,
        }
      );
      if (updateError) throw updateError;

      // update zone
      const { error: zoneUpdateError } = await supabase
        .from("zones")
        .update({ next_pt_shift_id: newShift[0].id })
        .eq("id", zoneId);
      if (zoneUpdateError) throw zoneUpdateError;
    } catch (error) {
      console.error(error);
    }
  },
};
