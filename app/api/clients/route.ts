
import { NextResponse } from 'next/server';
import { getClients, saveClient } from '@/lib/storage';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const clients = await getClients();

    if (id) {
        const client = clients.find(c => c.id === id);
        if (client) {
            return NextResponse.json(client);
        } else {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }
    }

    return NextResponse.json(clients);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        // Basic validation
        if (!data.firstName || !data.lastName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const newClient = await saveClient(data);
        return NextResponse.json(newClient);
    } catch (error) {
        console.error('Error saving client:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { deleteClient, updateClient } from '@/lib/storage';

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        if (!data.id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const updated = await updateClient(data.id, data);
        if (!updated) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating client:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing client ID' }, { status: 400 });
    }

    const success = await deleteClient(id);
    if (!success) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
}
