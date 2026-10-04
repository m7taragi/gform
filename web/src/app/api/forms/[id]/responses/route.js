import { NextResponse } from 'next/server';
import FormService from '@/lib/services/formService';
import FormRepository from '@/lib/repositories/formRepository';

const formService = new FormService(new FormRepository());

export async function GET(request, { params }) {
    try {
        const records = await formService.getFormResponses(params.id);
        return NextResponse.json(records);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const body = await request.json();
        await formService.submitResponse(body);
        return NextResponse.json({ message: "Response recorded successfully." }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
