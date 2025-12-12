
import { NextResponse } from 'next/server';
import { saveMealPlan, getMealPlans, deleteMealPlan, updateMealPlan } from '@/lib/storage';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const id = searchParams.get('id');

    // If ID provided, return single plan (or should we implement findById in storage?)
    // Existing getMealPlans filters by clientId.
    // Let's rely on storage helper or filter manually if needed.
    // storage only has getMealPlans(clientId).
    // I should probably add getMealPlanById to storage or just fetch all and find?
    // Storage read is cheap for JSON.
    const plans = await getMealPlans(clientId || undefined);
    
    if (id) {
        const plan = plans.find(p => p.id === id);
        if (plan) return NextResponse.json(plan);
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(plans);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { plan, clientId, name } = body;

        if (!plan || !clientId) {
            return NextResponse.json({ error: 'Missing plan or client ID' }, { status: 400 });
        }
        
        const newPlan = await saveMealPlan(plan, clientId, name);
        return NextResponse.json(newPlan);
    } catch (error) {
        console.error('Error saving meal plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, updates } = body;
        
        if (!id || !updates) {
             return NextResponse.json({ error: 'Missing ID or updates' }, { status: 400 });
        }

        const updated = await updateMealPlan(id, updates);
        if (updated) {
            return NextResponse.json(updated);
        } else {
             return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating meal plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const success = await deleteMealPlan(id);
    if (success) {
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
}
