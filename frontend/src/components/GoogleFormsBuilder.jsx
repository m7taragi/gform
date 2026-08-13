import React, { useState } from 'react';
import { PlusCircle, CornerDownRight, Trash2, ArrowUp, ArrowDown, Save, HelpCircle, Layers } from 'lucide-react';

export default function GoogleFormsBuilder({ onSaveForm, initialQuestions = [] }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState(initialQuestions.length > 0 ? initialQuestions : [
        {
            id: "q_" + Date.now(),
            shortHeading: "main_category_1",
            questionText: "Primary Performance Category",
            dataType: "matrix_row",
            isMandatory: false,
            isCumulativeTracked: false,
            minExpectedValue: null,
            maxExpectedValue: null,
            parentQuestionId: null
        }
    ]);
    const [activeQuestionId, setActiveQuestionId] = useState(questions[0]?.id || null);

    // 1. Add a main top-level question one by one
    const addMainQuestion = (type = 'text') => {
        const newId = "q_" + Date.now();
        const newQuestion = {
            id: newId,
            shortHeading: `question_${questions.length + 1}`,
            questionText: '',
            dataType: type,
            isMandatory: false,
            isCumulativeTracked: type === 'number',
            minExpectedValue: null,
            maxExpectedValue: null,
            parentQuestionId: null
        };
        setQuestions(prev => [...prev, newQuestion]);
        setActiveQuestionId(newId);
    };

    // 2. Add a nested sub-question directly under a specific parent question one by one
    const addNestedQuestion = (parentId, parentHeading) => {
        const newId = "q_sub_" + Date.now();
        const parentSlug = parentHeading ? parentHeading.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'parent';
        const subCount = questions.filter(q => q.parentQuestionId === parentId || q.parentQuestionId === parentSlug).length + 1;

        const newSubQuestion = {
            id: newId,
            shortHeading: `${parentSlug}_sub_${subCount}`,
            questionText: '',
            dataType: 'number',
            isMandatory: false,
            isCumulativeTracked: true,
            minExpectedValue: 0,
            maxExpectedValue: 1000,
            parentQuestionId: parentSlug || parentId
        };

        // Find index of parent question to insert right underneath
        const parentIdx = questions.findIndex(q => q.id === parentId || q.shortHeading === parentId);
        if (parentIdx !== -1) {
            const updated = [...questions];
            updated.splice(parentIdx + subCount, 0, newSubQuestion);
            setQuestions(updated);
        } else {
            setQuestions(prev => [...prev, newSubQuestion]);
        }
        setActiveQuestionId(newId);
    };

    // Update question field
    const updateQuestion = (id, field, value) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === id) {
                // If shortHeading is updated, update children that reference it as parentQuestionId
                if (field === 'shortHeading' && q.dataType === 'matrix_row') {
                    const oldSlug = q.shortHeading;
                    const newSlug = value;
                    setQuestions(all => all.map(child =>
                        child.parentQuestionId === oldSlug ? { ...child, parentQuestionId: newSlug } : child
                    ));
                }
                return { ...q, [field]: value };
            }
            return q;
        }));
    };

    // Remove question
    const removeQuestion = (id) => {
        setQuestions(prev => prev.filter(q => q.id !== id && q.parentQuestionId !== id));
    };

    // Move question up or down
    const moveQuestion = (idx, direction) => {
        const targetIdx = idx + direction;
        if (targetIdx < 0 || targetIdx >= questions.length) return;
        const updated = [...questions];
        const [moved] = updated.splice(idx, 1);
        updated.splice(targetIdx, 0, moved);
        setQuestions(updated);
    };

    const handleSave = () => {
        if (!title.trim()) {
            alert("Please enter a Form Title.");
            return;
        }
        if (questions.length === 0) {
            alert("Please add at least one question.");
            return;
        }
        if (onSaveForm) {
            onSaveForm({ title, description, questions });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Form Settings Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-t-8 border-t-indigo-600 space-y-4">
                <input
                    type="text"
                    placeholder="Untitled Form Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2 focus:outline-none focus:border-indigo-600 transition-colors"
                />
                <input
                    type="text"
                    placeholder="Form Description / Instructions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-sm text-gray-600 focus:outline-none"
                />
            </div>

            {/* Questions List — One By One Interactive Cards */}
            <div className="space-y-4">
                {questions.map((q, idx) => {
                    const isParent = q.dataType === 'matrix_row' || !q.parentQuestionId;
                    const isNested = Boolean(q.parentQuestionId);
                    const isActive = activeQuestionId === q.id;

                    return (
                        <div
                            key={q.id || idx}
                            onClick={() => setActiveQuestionId(q.id)}
                            className={`p-5 rounded-xl border transition-all shadow-xs ${
                                isNested ? 'ml-8 bg-indigo-50/30 border-indigo-200' : 'bg-white border-gray-200'
                            } ${isActive ? 'ring-2 ring-indigo-500 border-transparent shadow-md' : 'hover:border-gray-300'}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {isNested && <CornerDownRight size={18} className="text-indigo-500" />}
                                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                        Q{idx + 1} {isNested ? '(Nested Sub-Question)' : '(Parent Question)'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); moveQuestion(idx, -1); }}
                                        disabled={idx === 0}
                                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); moveQuestion(idx, 1); }}
                                        disabled={idx === questions.length - 1}
                                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }}
                                        className="p-1 text-red-400 hover:text-red-600 cursor-pointer"
                                        title="Delete Question"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Question Statement / Label
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={isNested ? "e.g., Online Store Daily Conversions" : "e.g., Enter Category Group Heading"}
                                        value={q.questionText}
                                        onChange={(e) => updateQuestion(q.id, 'questionText', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Response Input Type
                                    </label>
                                    <select
                                        value={q.dataType}
                                        onChange={(e) => updateQuestion(q.id, 'dataType', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="text">Text Input</option>
                                        <option value="number">Numeric Metric</option>
                                        <option value="date">Date</option>
                                        <option value="matrix_row">Matrix Parent Category</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Short Heading (Excel Key)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., sales_online"
                                        value={q.shortHeading}
                                        onChange={(e) => updateQuestion(q.id, 'shortHeading', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono bg-gray-50 focus:outline-none"
                                    />
                                </div>

                                {q.dataType === 'number' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                                Min Threshold
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Min (e.g., 0)"
                                                value={q.minExpectedValue ?? ''}
                                                onChange={(e) => updateQuestion(q.id, 'minExpectedValue', e.target.value !== '' ? Number(e.target.value) : null)}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                                Max Threshold
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Max (e.g., 1000)"
                                                value={q.maxExpectedValue ?? ''}
                                                onChange={(e) => updateQuestion(q.id, 'maxExpectedValue', e.target.value !== '' ? Number(e.target.value) : null)}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono focus:outline-none"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Question Action Controls */}
                            <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-3 mt-4">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-1.5 text-xs text-gray-600 font-medium cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={q.isMandatory}
                                            onChange={(e) => updateQuestion(q.id, 'isMandatory', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600"
                                        />
                                        Required Field
                                    </label>
                                    {q.dataType === 'number' && (
                                        <label className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={q.isCumulativeTracked}
                                                onChange={(e) => updateQuestion(q.id, 'isCumulativeTracked', e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600"
                                            />
                                            Track Cumulative Total
                                        </label>
                                    )}
                                </div>

                                {/* Per-Question "+ Add Nested Sub-Question" Action */}
                                <button
                                    type="button"
                                    onClick={() => addNestedQuestion(q.id, q.shortHeading || q.questionText)}
                                    className="flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                                >
                                    <CornerDownRight size={14} /> + Add Nested Sub-Question
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Form Control Toolbar */}
            <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky bottom-4 z-10">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => addMainQuestion('text')}
                        className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        <PlusCircle size={15} /> + Add Main Question
                    </button>
                    <button
                        type="button"
                        onClick={() => addMainQuestion('matrix_row')}
                        className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-2.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                    >
                        <Layers size={15} /> + Add Parent Category
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                    <Save size={18} /> Save Form Blueprint
                </button>
            </div>
        </div>
    );
}
