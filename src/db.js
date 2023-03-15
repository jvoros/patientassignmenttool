import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

function handleDataError(data, error, message) {
    if (error) {
        console.log(message, error);
        throw new Error(message, error);
    }
    return data;
}

export default {
    
    async getShifts() {
        const { data, error } = await supabase
            .from('shifts')
            .select(`
                *,
                shift_details(*),
                doctor:doctors(*),
                status:statuses(status)
            `)
            .order('rotation_order')
            
        if (error) { console.log(error); throw new Error(error); }

        return {
            on_rotation: data.filter(s=>s.status_id == 1),
            off_rotation: data.filter(s=>s.status_id == 2),
            ft_rotation: data.filter(s=>s.status_id == 3)
        };
    },

    async getShiftDetails() {
        const { data, error } = await supabase
            .from('shift_details')
            .select()
            .order('order')
        
        return handleDataError(data, error, 'getShiftDetails');
    },

    async getDoctors() {
        const { data, error } = await supabase 
            .from('doctors')
            .select()
            .order('last')
        return handleDataError(data, error, 'getDoctors');
    },

    async newRowOrders(neworder) {
        const { data, error } = await supabase
            .from('shifts')
            .upsert(neworder)
            .select();
        return handleDataError(data, error, 'newRowOrders');
    },
    
    async newShift(params) {
        const { data, error } = await supabase
            .from('shifts')
            .insert([params])
            .select();
        return handleDataError(data, error, 'newShift');
    },

    async updateShift(shift_id, params) {
        const { data, error } = await supabase
            .from('shifts')
            .update(params)
            .eq('id', shift_id)
            .select();
        return handleDataError(data, error, 'updateShift');
    },

    async goOffRotation(shift_id, status_id = 2) {
        const { data, error } = await supabase
            .from('shifts')
            .update({ status_id: status_id, rotation_order: null })
            .eq('id', shift_id)
            .select()
        return handleDataError(data, error, 'goOffRotation');
    },

    // if turn true, also increments turn
    async incrementCount(shift, type, turn = false) {
        let updateQuery;
        if (turn) {
            updateQuery = { [type]: shift[type]+1, turn: shift.turn+1 };
        } else {
            updateQuery = { [type]: shift[type]+1 };
        }

        const { data, error } = await supabase
            .from('shifts')
            .update(updateQuery)
            .eq('id', shift.id)
            .select();
        return handleDataError(data, error, 'incrementCount');
    },

    async decrementCount(shift, type) {
        const { data, error } = await supabase
            .from('shifts')
            .update({[type]: shift[type]-1})
            .eq('id', shift.id)
            .select();
        return handleDataError(data, error, 'decrementCount');
    },

    async resetBoard(shiftQuery) {
        const { data, error } = await supabase
            .from('shifts')
            .upsert(shiftQuery)
            .select();
        return handleDataError(data, error, 'resetBoard');
    }
    
}
