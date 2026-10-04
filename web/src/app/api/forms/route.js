import { NextResponse } from 'next/server';
import FormService from '@/lib/services/formService';
import FormRepository from '@/lib/repositories/formRepository';

const formService = new FormService(new FormRepository());

export async function GET() {
    try {
        const forms = await formService.getAllForms();
        return NextResponse.json(forms);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const savedForm = await formService.createForm(body);
        return NextResponse.json(savedForm, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes('required') ? 400 : 500 });
    }
}
