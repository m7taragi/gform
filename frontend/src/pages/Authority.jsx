import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import GoogleFormsBuilder from '../components/GoogleFormsBuilder';
import MatrixReportDemo from '../components/MatrixReportDemo';
import { FileSpreadsheet, PlusCircle, LayoutGrid } from 'lucide-react';

function Authority({ initialForm }) {
    const [activeTab, setActiveTab] = useState('builder');
    const [statusMsg, setStatusMsg] = useState(null);

    const handleSaveBlueprint = async (formData) => {
        try {
            await axios.post(`${API_BASE_URL}/forms`, formData);
            setStatusMsg({ type: 'success', text: 'Form Blueprint successfully saved to MongoDB!' });
            setTimeout(() => setStatusMsg(null), 4000);
        } catch (error) {
            console.error("Save error:", error);
            setStatusMsg({ type: 'error', text: `Failed to save blueprint: ${error.response?.data?.error || error.message}` });
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Workspace Navigation Tabs */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Executive Authority Workspace</h2>
                    <p className="text-xs text-gray-500">Design nested Google Forms blueprints and view Option B aggregated matrix reports.</p>
                </div>

                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('builder')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            activeTab === 'builder'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <PlusCircle size={14} /> Form Builder
                    </button>
                    <button
                        onClick={() => setActiveTab('matrix')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            activeTab === 'matrix'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <LayoutGrid size={14} /> Matrix Report View
                    </button>
                </div>
            </div>

            {statusMsg && (
                <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    <span>{statusMsg.text}</span>
                    <button onClick={() => setStatusMsg(null)} className="text-gray-500 font-bold hover:text-gray-700">✕</button>
                </div>
            )}

            {activeTab === 'builder' ? (
                <GoogleFormsBuilder
                    onSaveForm={handleSaveBlueprint}
                    initialQuestions={initialForm?.initialQuestions || []}
                />
            ) : (
                <MatrixReportDemo />
            )}
        </div>
    );
}

export default Authority;
