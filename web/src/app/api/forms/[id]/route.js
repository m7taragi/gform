import { NextResponse } from 'next/server';
import FormService from '@/lib/services/formService';
import FormRepository from '@/lib/repositories/formRepository';

const formService = new FormService(new FormRepository());

export async function GET(request, { params }) {
    try {
        const form = await formService.getFormById(params.id);
        return NextResponse.json(form);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes('not found') ? 404 : 500 });
    }
}
