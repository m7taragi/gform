import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, ClipboardList } from 'lucide-react';
import axios from 'axios';

function Employee() {
    const { user } = useContext(AuthContext);
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [answers, setAnswers] = useState({}); // Stores local inputs matching shortHeadings
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Pull the active structural blueprints created by Authorities
        axios.get('http://localhost:5000/api/forms')
            .then(res => setForms(res.data))
            .catch(err => console.error("Error pulling surveys", err));
    }, []);

    const handleInputChange = (shortHeading, val) => {
        setAnswers({ ...answers, [shortHeading]: val });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Package payload tracking who is filling it out automatically
            const submissionPayload = {
                formId: selectedForm._id,
                respondentType: user?.role || "employee",
                trackerId: user?.trackerId || "generic_office_node",
                answers: Object.keys(answers).map(key => ({
                    shortHeading: key,
                    value: answers[key]
                }))
            };

            await axios.post(`http://localhost:5000/api/forms/${selectedForm._id}/submit`, submissionPayload);
            setSubmitted(true);
            setAnswers({});
        } catch (err) {
            alert("Submission error occurred.");
        }
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto text-center p-8 bg-white border border-gray-200 rounded-lg space-y-4 mt-12">
                <CheckCircle className="mx-auto text-emerald-500" size={48} />
                <h3 className="text-lg font-bold text-gray-800">Log Entry Saved Cleanly</h3>
                <p className="text-xs text-gray-500">Data variables logged under station code: <b>{user?.trackerId}</b></p>
                <button onClick={() => { setSubmitted(false); setSelectedForm(null); }} className="text-xs bg-gray-100 hover:bg-gray-200 font-medium px-4 py-2 rounded">
                    Return to Assigned Logs List
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-md border border-gray-200 flex justify-between items-center shadow-sm">
                <div>
                    <h2 className="text-md font-bold text-gray-800">Operator Workspace Node</h2>
                    <p className="text-xs text-gray-500">Logged in as: {user?.name} | Location Node: <span className="font-mono bg-gray-100 px-1 rounded">{user?.trackerId}</span></p>
                </div>
            </div>

            {!selectedForm ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <ClipboardList size={16} /> Active Operational Reporting Tasks
                    </h3>
                    {forms.length === 0 ? <p className="text-xs text-gray-400 italic">No assigned surveys currently pending.</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {forms.map(f => (
                                <div key={f._id} className="p-4 border border-gray-200 rounded-md hover:border-blue-400 transition-colors bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">{f.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-1">{f.description}</p>
                                    </div>
                                    <button onClick={() => setSelectedForm(f)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors">
                                        Open Entry Log
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleFormSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{selectedForm.title}</h3>
                        <p className="text-xs text-gray-500">{selectedForm.description}</p>
                    </div>

                    <div className="space-y-4 border-t border-gray-100 pt-4">
                        {selectedForm.questions.map((q, idx) => {
                            // Highlight structural Matrix block parent headers
                            if (q.dataType === 'matrix_row' || q.shortHeading.endsWith('_parent')) {
                                return (
                                    <div key={idx} className="bg-gray-100 p-2 text-xs font-bold text-gray-700 tracking-wide rounded mt-4 uppercase">
                                        {q.questionText}
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className={`space-y-1 p-2 rounded ${q.parentQuestionId ? 'pl-6 border-l-2 border-l-blue-400 bg-blue-50/10' : ''}`}>
                                    <label className="block text-xs font-medium text-gray-700">
                                        {q.questionText} {q.isMandatory && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type={q.dataType === 'number' ? 'number' : q.dataType === 'date' ? 'date' : 'text'}
                                        required={q.isMandatory}
                                        onChange={(e) => handleInputChange(q.shortHeading, e.target.value)}
                                        className="w-full max-w-lg border border-gray-300 rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded shadow-sm">
                            Submit Form Record
                        </button>
                        <button type="button" onClick={() => setSelectedForm(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Employee;
