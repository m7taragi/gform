import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ClipboardList, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import GoogleFormsFiller from '../components/GoogleFormsFiller';

function Employee({ initialForm }) {
    const { user } = useContext(AuthContext);
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);

    useEffect(() => {
        // Pull active forms from backend, fallback to initialForm if empty
        axios.get(`${API_BASE_URL}/forms`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setForms(res.data);
                } else if (initialForm) {
                    setForms([{
                        _id: initialForm.formId || "demo_form_1",
                        title: initialForm.title,
                        description: initialForm.description,
                        questions: initialForm.initialQuestions || []
                    }]);
                }
            })
            .catch(() => {
                if (initialForm) {
                    setForms([{
                        _id: initialForm.formId || "demo_form_1",
                        title: initialForm.title,
                        description: initialForm.description,
                        questions: initialForm.initialQuestions || []
                    }]);
                }
            });
    }, [initialForm]);

    const handleFormSubmit = async (payload) => {
        try {
            await axios.post(`${API_BASE_URL}/submissions`, {
                ...payload,
                submittedBy: user?.email || user?.name || "employee_user"
            });
        } catch (err) {
            console.warn("Backend submission fallback notice:", err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-xs">
                <div>
                    <h2 className="text-md font-bold text-gray-800">Operator Form Entry Workspace</h2>
                    <p className="text-xs text-gray-500">Logged in as: <b>{user?.name}</b> | Station ID: <span className="font-mono bg-gray-100 px-1 rounded">{user?.trackerId || "STATION_NODE_1"}</span></p>
                </div>
            </div>

            {!selectedForm ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <ClipboardList size={16} className="text-indigo-600" /> Active Operational Forms
                    </h3>
                    {forms.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No assigned surveys currently pending.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {forms.map(f => (
                                <div key={f._id} className="p-5 border border-gray-200 rounded-xl hover:border-indigo-400 transition-colors bg-gray-50/50 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">{f.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{f.description}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedForm(f)}
                                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                                    >
                                        Open Step Form <ArrowRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <GoogleFormsFiller
                    form={selectedForm}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setSelectedForm(null)}
                />
            )}
        </div>
    );
}

export default Employee;
