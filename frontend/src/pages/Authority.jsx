import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, Save, FileSpreadsheet } from 'lucide-react';

function Authority() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);

    // Add a standard root standalone question
    const addStandardQuestion = () => {
        setQuestions([...questions, {
            shortHeading: '',
            questionText: '',
            dataType: 'text',
            isMandatory: false,
            parentQuestionId: null
        }]);
    };

    // Add a grouped Matrix component (Parent Category with tied sub-rows)
    const addMatrixGroup = () => {
        const mainHeading = prompt("Enter Main Heading Group Name (e.g., Sales, Logistics, Expenses):");

        if (!mainHeading) return; // Exit if user cancels prompt

        // Create a standardized clean slug string to act as the permanent parent anchor ID
        const parentAnchorId = mainHeading.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_parent';

        setQuestions([
            ...questions,
            // 1. The main parent heading structural boundary configuration row
            {
                shortHeading: parentAnchorId,
                questionText: `=== Category Group: ${mainHeading} ===`,
                dataType: 'text',
                isMandatory: false,
                parentQuestionId: null // It has no parent; it IS the parent anchor
            },
            // 2. Automated Child Sub-Question 1
            {
                shortHeading: `${mainHeading.toLowerCase()}_online`,
                questionText: 'Online Channel',
                dataType: 'number',
                isMandatory: false,
                parentQuestionId: parentAnchorId // Linked directly to parentAnchorId
            },
            // 3. Automated Child Sub-Question 2
            {
                shortHeading: `${mainHeading.toLowerCase()}_shop`,
                questionText: 'Physical Shop storefront',
                dataType: 'number',
                isMandatory: false,
                parentQuestionId: parentAnchorId // Linked directly to parentAnchorId
            }
        ]);
    };


    // Dynamically update unique fields across the structural array block
    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    // Remove a question or sub-question block row
    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    // Post the completed dynamic structural blueprint to your Vercel/Local Backend
    const saveFormBlueprint = async () => {
        if (!title || questions.length === 0) {
            alert('Please fill out the Form Title and add at least one question.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/forms', {
                title,
                description,
                questions
            });
            alert('Form Configuration successfully saved to MongoDB Atlas Cloud!');
            // Reset layout on success
            setTitle('');
            setDescription('');
            setQuestions([]);
        } catch (error) {
            console.error(error);
            alert('Error saving configuration blueprint.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Step Header Block */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Create Custom Reporting Form</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Form/Survey Title (e.g., Weekly Sales Audit)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Brief Form Description or instructions..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Dynamic Questions Builder Listing Area */}
            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg border shadow-sm flex flex-col md:flex-row gap-4 items-center bg-white ${q.parentQuestionId ? 'border-l-4 border-l-blue-500 bg-blue-50/20' : 'border-gray-200'
                            }`}
                    >
                        {/* Column Short Heading mapping for clean Excel spreadsheets */}
                        <div className="w-full md:w-1/4">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Excel Column Heading (Short)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., sales_online"
                                value={q.shortHeading}
                                onChange={(e) => updateQuestion(index, 'shortHeading', e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50 font-mono text-xs focus:outline-none"
                            />
                        </div>

                        {/* Display Question Input Context Text */}
                        <div className="w-full md:w-2/5">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                {q.parentQuestionId ? 'Sub-Question Text / Label' : 'Main Question String'}
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Enter total online store revenue matching receipts"
                                value={q.questionText}
                                onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none"
                            />
                        </div>

                        {/* Selecting Response Data Input Constraint Filter Type */}
                        <div className="w-full md:w-1/5">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Data Input Type
                            </label>
                            <select
                                value={q.dataType}
                                onChange={(e) => updateQuestion(index, 'dataType', e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:outline-none"
                            >
                                <option value="text">Plain Text</option>
                                <option value="number">Numeric Integer</option>
                                <option value="date">Calendar Date</option>
                                <option value="matrix_row">Matrix Sub-Row</option>
                            </select>
                        </div>

                        {/* Mandatory Checkbox constraint validator parameter */}
                        <div className="flex items-center space-x-2 pt-4 md:pt-0">
                            <input
                                type="checkbox"
                                id={`mand_${index}`}
                                checked={q.isMandatory}
                                onChange={(e) => updateQuestion(index, 'isMandatory', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <label htmlFor={`mand_${index}`} className="text-xs font-medium text-gray-600 select-none">
                                Mandatory
                            </label>
                        </div>

                        {/* Delete Component Action Node Button */}
                        <button
                            onClick={() => removeQuestion(index)}
                            className="text-red-500 hover:text-red-700 p-1 mt-4 md:mt-0 transition-colors"
                            title="Remove Question"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Interface Build Control Panel Action Bar Area */}
            <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex gap-3">
                    <button
                        onClick={addStandardQuestion}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        <PlusCircle size={16} /> Add Standard Question
                    </button>
                    <button
                        onClick={addMatrixGroup}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        <FileSpreadsheet size={16} /> Add Matrix Sub-Question
                    </button>
                </div>

                <button
                    onClick={saveFormBlueprint}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                >
                    <Save size={16} /> Save Survey Layout
                </button>
            </div>
        </div>
    );
}

function ExcelExportManager({ formId, questionsList }) {
    const [loading, setLoading] = useState(false);

    const downloadExcelTabularReport = async () => {
        setLoading(true);
        try {
            // 1. Fetch raw responses from the MongoDB cloud
            const response = await fetch(`http://localhost:5000/api/forms/${formId}/responses`);
            const rawSubmissions = await response.json();

            if (rawSubmissions.length === 0) {
                alert("No submissions available to export yet.");
                setLoading(false);
                return;
            }

            // 2. Define our static structural metadata column headers
            const baseHeaders = ["Submission_Date", "Respondent_Type", "Identifier_Node"];

            // Filter out matrix structural headings to only keep dynamic input data headers
            const questionHeaders = questionsList
                .filter(q => q.dataType !== 'matrix_row' && q.shortHeading)
                .map(q => q.shortHeading);

            const completeCsvHeaders = [...baseHeaders, ...questionHeaders];

            // 3. Map nested data vectors into perfectly flattened rows
            const csvRows = rawSubmissions.map(submission => {
                const dateStr = new Date(submission.createdAt).toLocaleDateString();
                const typeStr = submission.respondentType || "public_visitor";
                const trackerStr = submission.trackerId || "N/A";

                // Build a temporary fast lookup dictionary maps for child answers
                const answerMap = {};
                submission.answers.forEach(ans => {
                    answerMap[ans.shortHeading] = ans.value;
                });

                // Loop over column headers to extract side-by-side cells cleanly
                const answerCells = questionHeaders.map(headerKey => {
                    const value = answerMap[headerKey];
                    return value !== undefined ? `"${String(value).replace(/"/g, '""')}"` : '""';
                });

                return [`"${dateStr}"`, `"${typeStr}"`, `"${trackerStr}"`, ...answerCells].join(",");
            });

            // 4. Wrap elements and compile the physical system download string file
            const csvContent = [completeCsvHeaders.join(","), ...csvRows].join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `Survey_Report_${formId}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Export generation failed:", err);
            alert("Failed to compile CSV spreadsheet.");
        }
        setLoading(false);
    };

    return (
        <div className="mt-4 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-between">
            <div>
                <h4 className="text-sm font-semibold text-gray-700">Tabular Reports Manager</h4>
                <p className="text-xs text-gray-500">Download formatted rows directly for Excel parsing and pivot tables.</p>
            </div>
            <button
                onClick={downloadExcelTabularReport}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded shadow-sm flex items-center gap-2 transition-colors disabled:bg-gray-400"
            >
                {loading ? "Processing..." : "📥 Download Live Excel (.CSV)"}
            </button>
        </div>
    );
}
export default Authority;
