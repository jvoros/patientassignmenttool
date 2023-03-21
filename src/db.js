import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const ENV = process.env.NODE_ENV || 'development';

const supabase = (ENV == 'production') ? 
    createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY) :
    createClient(process.env.DEV_URL, process.env.DEV_KEY);

function handleDataError(data, error, message) {
    if (error) {
        // log the supabase error
        // throw error message to client via express middleware
        console.log(error);
        throw new Error(message);
    }
    return data;
}

// DB Methods
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
            
        if (error) { 
            console.error(error);
            throw new Error('Server error getting shifts. Refresh to try again.'); 
        }

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
        
        return handleDataError(data, error, 'Server error getting shift details.');
    },

    async getDoctors() {
        const { data, error } = await supabase 
            .from('doctors')
            .select()
            .order('last')
        return handleDataError(data, error, 'Server error getting doctor list.');
    },

    async newRowOrders(neworder) {
        const { data, error } = await supabase
            .from('shifts')
            .upsert(neworder)
            .select();
        return handleDataError(data, error, 'Server error updating row orders.');
    },
    
    async newShift(params) {
        const { data, error } = await supabase
            .from('shifts')
            .insert([params])
            .select();
        return handleDataError(data, error, 'Server error adding a new shift.');
    },

    async updateShift(shift_id, params) {
        const { data, error } = await supabase
            .from('shifts')
            .update(params)
            .eq('id', shift_id)
            .select();
        return handleDataError(data, error, 'Server error updating shifts.');
    },

    async goOffRotation(shift_id, status_id = 2) {
        const { data, error } = await supabase
            .from('shifts')
            .update({ status_id: status_id, rotation_order: null })
            .eq('id', shift_id)
            .select()
        return handleDataError(data, error, 'Server error moving shift off rotation.');
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
        return handleDataError(data, error, `Server error incrementing count for ${type}`);
    },

    async decrementCount(shift, type, turn = false) {
        let updateQuery;
        if (turn) {
            updateQuery = { [type]: shift[type]-1, turn: shift.turn-1 };
        } else {
            updateQuery = { [type]: shift[type]-1 };
        }
        const { data, error } = await supabase
            .from('shifts')
            .update(updateQuery)
            .eq('id', shift.id)
            .select();
        return handleDataError(data, error, `Server error decrementing count for ${type}`);
    },

    async resetBoard(shiftQuery) {
        const { data, error } = await supabase
            .from('shifts')
            .upsert(shiftQuery)
            .select();
        return handleDataError(data, error, 'Server error resetting board.');
    }
    
}
