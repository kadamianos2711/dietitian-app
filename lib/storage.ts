
import fs from 'fs/promises';
import path from 'path';
import { ClientFormData } from '@/types/client';
import { WeeklyPlan } from '@/types/engine';
import { v4 as uuidv4 } from 'uuid';

export interface MealPlan extends WeeklyPlan {
    id: string;
    clientId: string;
    name: string;
    createdAt: string;
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface DBData {
    clients: (ClientFormData & { id: string, createdAt: string })[];
    mealPlans: (WeeklyPlan & { id: string, clientId: string, createdAt: string, name?: string })[];
}

// In-memory cache for simple locking (not robust for multi-process but fine for local div)
let cache: DBData | null = null;

async function ensureDB() {
    try {
        await fs.access(DB_PATH);
    } catch {
        // Create if not exists
        const initialData: DBData = { clients: [], mealPlans: [] };
        await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
    }
}

async function readDB(): Promise<DBData> {
    await ensureDB();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

async function writeDB(data: DBData) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    cache = data;
}

export async function getClients() {
    const db = await readDB();
    return db.clients;
}

export async function getClient(id: string) {
    const db = await readDB();
    return db.clients.find(c => c.id === id) || null;
}

export async function saveClient(client: ClientFormData) {
    const db = await readDB();
    const newClient = {
        ...client,
        id: uuidv4(),
        createdAt: new Date().toISOString()
    };
    db.clients.push(newClient);
    await writeDB(db);
    return newClient;
}

export async function updateClient(id: string, updates: Partial<ClientFormData>) {
    const db = await readDB();
    const idx = db.clients.findIndex(c => c.id === id);
    if (idx === -1) return null;
    
    db.clients[idx] = { ...db.clients[idx], ...updates };
    await writeDB(db);
    return db.clients[idx];
}

export async function deleteClient(id: string) {
    const db = await readDB();
    const idx = db.clients.findIndex(c => c.id === id);
    if (idx === -1) return false;

    db.clients.splice(idx, 1);
    await writeDB(db);
    return true;
}

export async function getMealPlans(clientId?: string) {
    const db = await readDB();
    if (clientId) {
        return db.mealPlans.filter(p => p.clientId === clientId);
    }
    return db.mealPlans;
}

export async function saveMealPlan(plan: WeeklyPlan, clientId: string, name?: string) {
    const db = await readDB();
    const newPlan = {
        ...plan,
        id: uuidv4(),
        clientId,
        name: name || `Διαιτολόγιο ${new Date().toLocaleDateString('el-GR')}`,
        createdAt: new Date().toISOString()
    };
    db.mealPlans.push(newPlan);
    await writeDB(db);
    return newPlan;
}

export async function deleteMealPlan(id: string) {
    const db = await readDB();
    const idx = db.mealPlans.findIndex(p => p.id === id);
    if (idx === -1) return false;

    db.mealPlans.splice(idx, 1);
    await writeDB(db);
    return true;
}

export async function updateMealPlan(id: string, updates: Partial<MealPlan>) {
    const db = await readDB();
    const idx = db.mealPlans.findIndex(p => p.id === id);
    if (idx === -1) return null;

    db.mealPlans[idx] = { ...db.mealPlans[idx], ...updates };
    await writeDB(db);
    return db.mealPlans[idx];
}
