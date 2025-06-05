//route.ts
import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';

interface ClickCountData {
  click_count: number | null | undefined;
}

const supabase = createClient();

export async function POST(req: Request) {
    try {
        const { phoneNumber, tableName } = await req.json();
        console.log('Received phoneNumber:', phoneNumber);
        console.log('Received tableName:', tableName);

        if (!phoneNumber || !tableName) {
            return NextResponse.json({ error: 'Phone number and table name are required' }, { status: 400 });
        }

        // Add this section to log before the update
        const { data: selectData, error: selectError } = await supabase
            .from(tableName)
            .select('id, "Phone Num", click_count')
            .match({ 'Phone Num': phoneNumber })
            .maybeSingle<ClickCountData>();

        console.log('Supabase SELECT query data:', selectData);
        console.log('Supabase SELECT query error:', selectError);

        let newClickCount = 0;
        if (selectData && selectData.click_count !== null && selectData.click_count !== undefined) {
            newClickCount = selectData.click_count + 1;
        }

        const { data, error } = await supabase
            .from(tableName)
            //.update({ click_count: () => 'click_count + 1' })
            .update({ click_count: newClickCount })
            .match({ 'Phone Num': phoneNumber });

        console.log('UPDATE query data:', data);
        console.log('UPDATE query error:', error);


        if (error) {
            console.error(`Error updating click count in table '${tableName}':`, error);
            return NextResponse.json({ error: `Failed to update click count in table '${tableName}'` }, { status: 500 });
        }

        return NextResponse.json({ message: `Click count updated successfully in table '${tableName}'` }, { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}