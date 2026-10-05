"use client";
import React, { useState, useEffect } from "react";
import { Send, Plus, Trash2, ArrowRight, ArrowLeft, Table2, List } from "lucide-react";

import { submitFormAction } from "../app/actions/submit";
import { getMasterDataListsAction } from "../app/actions/masterData";

// ----------------------------------------------------------------------
// 1. CLASSIC FORM RENDERER (Original Vertical Layout)
// ----------------------------------------------------------------------
function QuestionRenderer({ question, allQuestions, responses, handleInputChange, masterDataDict, level = 0, iterationIndex = 0 }) {
  if (question.showIf) {
    try {
      const logic = JSON.parse(question.showIf);
      if (logic.dependsOnId) {
        const dependentValue = responses[`${logic.dependsOnId}_${iterationIndex}`] || responses[`${logic.dependsOnId}_0`] || "";
        const expectedValue = logic.value || "";
        if (logic.operator === "equals" && dependentValue !== expectedValue) return null;
        if (logic.operator === "not_equals" && dependentValue === expectedValue) return null;
      }
    } catch(e) {}
  }

  const children = allQuestions.filter(q => q.parentId === question.id);
  const isSection = question.dataType === "section";
  const isMatrix = question.dataType === "matrix";

  let masterOptions = [];
  if (question.dataType === "master_data" && question.options) {
    const list = masterDataDict[question.options];
    if (list) {
      try { masterOptions = JSON.parse(list.data); } catch (e) { masterOptions = []; }
    }
  }

  const responseKey = `${question.id}_${iterationIndex}`;

  return (
    <div className={`bg-surface p-6 rounded-xl border shadow-sm mb-4 ${level > 0 ? 'ml-6 md:ml-12 border-l-4 border-l-primary' : 'border-outline-variant'}`}>
      {isSection ? (
        <div className="border-b border-primary pb-2 mb-2">
          <h2 className="text-2xl font-bold text-primary">{question.questionText || question.shortHeading} {iterationIndex > 0 ? `(#${iterationIndex + 1})` : ''}</h2>
        </div>
      ) : (
        <label className="block mb-4">
          <span className="text-lg font-bold block mb-1">
            {question.questionText || question.shortHeading}
            {question.isRequired && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      
      {!isSection && (question.dataType === "text" || question.dataType === "number" || question.dataType === "date" || question.dataType === "location") && (
        <input
          type={question.dataType === "number" ? "number" : question.dataType === "date" ? "date" : "text"}
          required={question.isRequired}
          value={responses[responseKey] || ""}
          onChange={(e) => handleInputChange(question.id, iterationIndex, e.target.value)}
          className="w-full min-h-[48px] px-4 py-2 bg-surface-bright border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={question.dataType === "location" ? "Search location..." : "Type your answer..."}
        />
      )}

      {!isSection && question.dataType === "long_text" && (
        <textarea
          required={question.isRequired}
          value={responses[responseKey] || ""}
          onChange={(e) => handleInputChange(question.id, iterationIndex, e.target.value)}
          className="w-full min-h-[96px] px-4 py-2 bg-surface-bright border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      )}

      {!isSection && question.dataType === "boolean" && (
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer min-h-[48px]">
            <input type="radio" name={responseKey} required={question.isRequired} checked={responses[responseKey] === "true"} onChange={() => handleInputChange(question.id, iterationIndex, "true")} className="w-6 h-6 text-primary border-outline focus:ring-primary" />
            <span className="text-base font-medium">Yes</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer min-h-[48px]">
            <input type="radio" name={responseKey} required={question.isRequired} checked={responses[responseKey] === "false"} onChange={() => handleInputChange(question.id, iterationIndex, "false")} className="w-6 h-6 text-primary border-outline focus:ring-primary" />
            <span className="text-base font-medium">No</span>
          </label>
        </div>
      )}

      {!isSection && (question.dataType === "single_choice" || question.dataType === "master_data") && (
        <select
          required={question.isRequired}
          value={responses[responseKey] || ""}
          onChange={(e) => handleInputChange(question.id, iterationIndex, e.target.value)}
          className="w-full min-h-[48px] px-4 py-2 bg-surface-bright border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
        >
          <option value="" disabled>Select an option</option>
          {question.dataType === "master_data" 
            ? masterOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)
            : (question.options || "").split('\n').filter(o => o.trim() !== "").map((opt, i) => <option key={i} value={opt.trim()}>{opt.trim()}</option>)
          }
        </select>
      )}

      {!isSection && question.dataType === "rating" && (
        <div className="flex items-center gap-4">
          <input type="range" min="1" max="5" step="1" required={question.isRequired} value={responses[responseKey] || "3"} onChange={(e) => handleInputChange(question.id, iterationIndex, e.target.value)} className="w-full max-w-sm h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary" />
          <span className="font-bold text-xl text-primary">{responses[responseKey] || "3"} / 5</span>
        </div>
      )}
      
      {!isSection && isMatrix && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-outline">
                <th className="p-3"></th>
                {(question.options || "").split('\n').filter(o => o.trim() !== "").map((col, i) => <th key={i} className="p-3 text-center font-bold text-on-surface">{col.trim()}</th>)}
              </tr>
            </thead>
            <tbody>
              {children.map(row => (
                <tr key={row.id} className="border-b border-outline-variant hover:bg-surface-variant/30">
                  <td className="p-3 font-medium text-on-surface">{row.questionText}{row.isRequired && <span className="text-error ml-1">*</span>}</td>
                  {(question.options || "").split('\n').filter(o => o.trim() !== "").map((col, i) => (
                    <td key={i} className="p-3 text-center">
                      <input type="radio" name={`${row.id}_${iterationIndex}`} required={row.isRequired} checked={responses[`${row.id}_${iterationIndex}`] === col.trim()} onChange={() => handleInputChange(row.id, iterationIndex, col.trim())} className="w-5 h-5 text-primary border-outline focus:ring-primary cursor-pointer" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isSection && children.length > 0 && (
        <div className="mt-6 pt-4 border-t border-outline-variant">
          {children.map((child) => (
            <SectionRepeater key={child.id} question={child} allQuestions={allQuestions} responses={responses} handleInputChange={handleInputChange} masterDataDict={masterDataDict} level={level + 1} parentIterationIndex={iterationIndex} />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionRepeater({ question, allQuestions, responses, handleInputChange, masterDataDict, level, parentIterationIndex }) {
  const [loops, setLoops] = useState(1);
  const isSection = question.dataType === "section";

  return (
    <div className="mb-4">
      {Array.from({ length: loops }).map((_, i) => {
        const currentIteration = question.isRepeatable ? i : parentIterationIndex;
        return (
          <div key={`${question.id}_${currentIteration}`} className="relative group">
            {question.isRepeatable && i > 0 && (
              <div className="flex justify-end mb-2 absolute top-4 right-4 z-10">
                <button type="button" onClick={() => setLoops(prev => Math.max(1, prev - 1))} className="text-error bg-error-container p-2 rounded-md hover:brightness-95 opacity-0 group-hover:opacity-100" title="Remove this group"><Trash2 size={16} /></button>
              </div>
            )}
            <QuestionRenderer question={question} allQuestions={allQuestions} responses={responses} handleInputChange={handleInputChange} masterDataDict={masterDataDict} level={level} iterationIndex={currentIteration} />
          </div>
        );
      })}
      
      {isSection && question.isRepeatable && (
        <button type="button" onClick={() => setLoops(l => l + 1)} className="mt-2 flex items-center gap-2 text-primary font-bold px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md">
          <Plus size={18} /> Add another {question.shortHeading || "Group"}
        </button>
      )}
    </div>
  );
}


// ----------------------------------------------------------------------
// 2. SPREADSHEET (GRID) MODE RENDERER
// ----------------------------------------------------------------------
function SpreadsheetCellInput({ question, value, onChange, masterDataDict }) {
  if (question.dataType === "boolean") {
     return (
       <div className="flex justify-center">
         <input type="checkbox" className="w-5 h-5 text-primary" checked={value === "true"} onChange={e => onChange(e.target.checked ? "true" : "false")} />
       </div>
     );
  }
  if (question.dataType === "single_choice" || question.dataType === "master_data") {
     let opts = [];
     if (question.dataType === "master_data" && masterDataDict[question.options]) {
         try { opts = JSON.parse(masterDataDict[question.options].data); } catch(e){}
     } else if (question.options) {
         opts = question.options.split('\n').filter(x => x.trim());
     }
     return (
       <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full bg-transparent p-2 outline-none cursor-pointer">
         <option value=""></option>
         {opts.map(o => <option key={o} value={o}>{o}</option>)}
       </select>
     )
  }
  if (question.dataType === "date") {
     return <input type="date" value={value || ""} onChange={e => onChange(e.target.value)} className="w-full bg-transparent p-2 outline-none" />
  }
  return <input type={question.dataType === "number" ? "number" : "text"} value={value || ""} onChange={e => onChange(e.target.value)} placeholder="-" className="w-full bg-transparent p-2 outline-none placeholder:text-on-surface-variant/40" />
}

function SpreadsheetView({ form, masterDataDict, setIsSubmitting, setMessage }) {
  const [draftRows, setDraftRows] = useState([]);
  
  // Storage keys
  const storageKey = `gform_drafts_${form.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setDraftRows(JSON.parse(saved)); } catch (e) {}
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(draftRows));
  }, [draftRows, storageKey]);

  // Compute Columns (Leaf questions)
  const leafQuestions = [];
  const traverse = (parentId, currentSection) => {
      const children = form.questions.filter(q => q.parentId === parentId).sort((a,b) => a.sortOrder - b.sortOrder);
      for (const child of children) {
          if (child.dataType === "section") {
              traverse(child.id, child);
          } else if (child.dataType !== "matrix") {
              // Ignore matrices for simple spreadsheet currently
              leafQuestions.push({ ...child, section: currentSection });
          }
      }
  }
  traverse(null, null);

  // Compute Group Headers
  const topHeaders = [];
  for (const leaf of leafQuestions) {
      const secId = leaf.section ? leaf.section.id : null;
      const secName = leaf.section ? (leaf.section.shortHeading || leaf.section.questionText) : "";
      
      if (topHeaders.length > 0 && topHeaders[topHeaders.length - 1].id === secId) {
          topHeaders[topHeaders.length - 1].colSpan += 1;
      } else {
          topHeaders.push({ id: secId, name: secName, colSpan: 1 });
      }
  }

  const addNewRow = () => {
    setDraftRows([...draftRows, {}]);
  };

  const updateRow = (idx, qId, val) => {
    const newRows = [...draftRows];
    newRows[idx] = { ...newRows[idx], [qId]: val };
    setDraftRows(newRows);
  };

  const removeRow = (idx) => {
    setDraftRows(draftRows.filter((_, i) => i !== idx));
  };

  const handleSubmitAll = async () => {
    if (draftRows.length === 0) return;
    
    // User Warning before Bulk Submit
    if (!window.confirm("⚠️ SUBMISSION WARNING\n\nOld or previous data CANNOT be edited by users after submission.\n\nAre you sure you want to securely submit all queued rows to the database?")) {
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    let successCount = 0;
    
    for (const row of draftRows) {
        const responsesPayload = Object.entries(row).map(([qId, val]) => ({ 
           questionId: qId, 
           iterationIndex: 0, 
           value: String(val) 
        })).filter(r => r.value !== "");

        if (responsesPayload.length === 0) continue; // Skip totally empty rows

        const payload = {
           formId: form.id,
           responses: responsesPayload,
        };

        try {
           const res = await submitFormAction(payload);
           if (res.success) successCount++;
        } catch (e) {
           console.error(e);
        }
    }
    
    localStorage.removeItem(storageKey);
    setDraftRows([]);
    setIsSubmitting(false);
    
    if (successCount > 0) {
       setMessage({ type: "success", text: `Successfully submitted ${successCount} record(s).`});
    } else {
       setMessage({ type: "error", text: "Failed to submit records."});
    }
  };

  if (leafQuestions.length === 0) {
    return <div className="p-8 text-center text-on-surface-variant italic">This form has no columns defined.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-primary/10 text-primary p-4 rounded-xl flex justify-between items-center border border-primary/20">
        <div>
           <h3 className="font-bold">Pending Records: {draftRows.length}</h3>
           <p className="text-sm">Data is saved to your local storage. Submit when ready.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={addNewRow} className="bg-surface text-primary font-bold px-4 py-2 rounded-md hover:bg-surface-variant border border-primary/20">
             + Add Row
           </button>
           <button 
             onClick={handleSubmitAll} 
             disabled={draftRows.length === 0}
             className="bg-primary text-on-primary font-bold px-4 py-2 rounded-md hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
           >
             <Send size={16}/> Submit All to Server
           </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-surface rounded-xl border border-outline-variant shadow-sm max-h-[60vh]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="sticky top-0 bg-surface-variant text-on-surface-variant z-10">
            {topHeaders.some(h => h.name) && (
              <tr>
                <th className="p-2 border-b border-r border-outline-variant bg-surface-variant/80 backdrop-blur"></th>
                {topHeaders.map((h, i) => (
                  <th key={i} colSpan={h.colSpan} className="p-2 border-b border-r border-outline-variant text-center font-bold text-primary bg-surface-variant/80 backdrop-blur">
                    {h.name}
                  </th>
                ))}
                <th className="p-2 border-b border-outline-variant bg-surface-variant/80 backdrop-blur"></th>
              </tr>
            )}
            <tr>
              <th className="p-3 border-b border-r border-outline-variant font-medium w-12 text-center text-xs">#</th>
              {leafQuestions.map((q) => (
                <th key={q.id} title={q.questionText} className="p-3 border-b border-r border-outline-variant font-medium min-w-[150px]">
                  {q.shortHeading || q.questionText || "Untitled"}
                  {q.isRequired && <span className="text-error ml-1">*</span>}
                </th>
              ))}
              <th className="p-3 border-b border-outline-variant font-medium w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {draftRows.length === 0 ? (
              <tr>
                <td colSpan={leafQuestions.length + 2} className="p-12 text-center text-on-surface-variant italic cursor-pointer hover:bg-surface-variant/30" onClick={addNewRow}>
                  Click "Add Row" to start entering data
                </td>
              </tr>
            ) : (
              draftRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-outline-variant hover:bg-surface-variant/30 group transition-colors">
                  <td className="p-2 border-r border-outline-variant text-center text-on-surface-variant text-sm bg-surface-bright/50">
                    {rowIndex + 1}
                  </td>
                  {leafQuestions.map((q) => (
                    <td key={q.id} className="p-0 border-r border-outline-variant bg-surface focus-within:bg-primary/5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary transition-colors">
                       <SpreadsheetCellInput 
                          question={q} 
                          value={row[q.id]} 
                          onChange={(val) => updateRow(rowIndex, q.id, val)}
                          masterDataDict={masterDataDict}
                       />
                    </td>
                  ))}
                  <td className="p-2 text-center bg-surface-bright/50">
                    <button onClick={() => removeRow(rowIndex)} className="text-on-surface-variant hover:text-error hover:bg-error-container p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100" title="Remove Row">
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. MAIN FORM VIEW COMPONENT
// ----------------------------------------------------------------------
export function FormView({ form }) {
  const [viewMode, setViewMode] = useState("spreadsheet"); // 'spreadsheet' | 'classic'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [masterDataDict, setMasterDataDict] = useState({});
  
  // Tab State for Classic View
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    getMasterDataListsAction().then(res => {
      if (res.success) {
        const dict = {};
        res.lists.forEach(list => dict[list.id] = list);
        setMasterDataDict(dict);
      }
    });
  }, []);

  if (message?.type === 'success') {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 mt-12 text-center bg-surface p-8 rounded-2xl border border-outline-variant shadow-sm">
        <h2 className="text-3xl font-bold mb-4 text-primary">Submission Complete</h2>
        <p className="text-xl text-on-surface-variant whitespace-pre-wrap">{message.text}</p>
        <button onClick={() => setMessage(null)} className="mt-8 px-6 py-2 bg-primary text-on-primary font-bold rounded-lg hover:brightness-110">
          Submit Another Entry
        </button>
      </div>
    );
  }

  if (!form.isActive) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 mt-12 text-center bg-surface p-8 rounded-2xl border border-outline-variant shadow-sm">
        <h2 className="text-3xl font-bold mb-4 text-primary">Form Closed</h2>
        <p className="text-xl text-on-surface-variant">This form is no longer accepting responses.</p>
      </div>
    );
  }

  return (
    <div className={`mx-auto p-4 md:p-6 lg:p-8 ${viewMode === 'spreadsheet' ? 'max-w-[95%]' : 'max-w-3xl'}`}>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-lg text-on-surface-variant whitespace-pre-wrap">{form.description}</p>
          )}
        </div>
        
        {/* VIEW MODE TOGGLE */}
        <div className="flex bg-surface-variant rounded-lg p-1 border border-outline-variant shrink-0">
          <button 
            onClick={() => setViewMode("spreadsheet")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-all ${viewMode === 'spreadsheet' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <Table2 size={16}/> Spreadsheet
          </button>
          <button 
            onClick={() => setViewMode("classic")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-all ${viewMode === 'classic' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <List size={16}/> Vertical Form
          </button>
        </div>
      </header>

      {message && message.type === 'error' && (
        <div className="mb-6 p-4 rounded-xl font-medium bg-[#fce8e6] text-[#c5221f]">
          {message.text}
        </div>
      )}

      {viewMode === 'spreadsheet' ? (
        <SpreadsheetView 
           form={form} 
           masterDataDict={masterDataDict} 
           setIsSubmitting={setIsSubmitting} 
           setMessage={setMessage} 
        />
      ) : (
        <ClassicFormView 
           form={form} 
           masterDataDict={masterDataDict}
           setIsSubmitting={setIsSubmitting}
           setMessage={setMessage}
           activeTab={activeTab}
           setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. CLASSIC FORM VIEW LOGIC
// ----------------------------------------------------------------------
function ClassicFormView({ form, masterDataDict, setIsSubmitting, setMessage, activeTab, setActiveTab }) {
  const [responses, setResponses] = useState({});

  const handleInputChange = (questionId, iterationIndex, value) => {
    setResponses((prev) => ({
      ...prev,
      [`${questionId}_${iterationIndex}`]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("⚠️ SUBMISSION WARNING\n\nOld or previous data CANNOT be edited by users after submission.\n\nAre you sure you want to securely submit to the database?")) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const responsesPayload = Object.entries(responses).map(([key, value]) => {
      const [questionId, iterationStr] = key.split('_');
      return {
        questionId,
        iterationIndex: parseInt(iterationStr, 10),
        value: String(value), 
      };
    }).filter(r => r.value !== "");

    const payload = {
      formId: form.id,
      responses: responsesPayload,
    };

    try {
      const result = await submitFormAction(payload);
      if (result.success) {
        setMessage({ type: "success", text: form.customSubmitMessage || "Thank you! Your response has been securely submitted." });
        setResponses({});
      } else {
        setMessage({ type: "error", text: result.error || "Failed to submit form." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "A network error occurred while submitting." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const rootQuestions = form.questions.filter(q => !q.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  const isMultiPage = form.layout === "multi_page" && rootQuestions.length > 1;
  const currentRootQuestions = isMultiPage ? [rootQuestions[activeTab]] : rootQuestions;

  return (
    <>
      {isMultiPage && (
        <div className="flex border-b border-outline mb-8 overflow-x-auto no-scrollbar">
          {rootQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-4 font-bold whitespace-nowrap transition-colors border-b-4 ${activeTab === idx ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'}`}
            >
              {q.shortHeading || q.questionText || `Page ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {currentRootQuestions.map((question) => (
          <SectionRepeater 
            key={question.id}
            question={question}
            allQuestions={form.questions}
            responses={responses}
            handleInputChange={handleInputChange}
            masterDataDict={masterDataDict}
            level={0}
            parentIterationIndex={0}
          />
        ))}

        <div className="pt-8 flex gap-4 mt-8">
          {isMultiPage && activeTab > 0 && (
            <button type="button" onClick={() => setActiveTab(a => a - 1)} className="flex-1 flex items-center justify-center gap-2 min-h-[56px] bg-surface-variant text-on-surface-variant font-bold rounded-xl hover:brightness-95 transition-all">
              <ArrowLeft size={20} /> Previous
            </button>
          )}

          {isMultiPage && activeTab < rootQuestions.length - 1 ? (
            <button type="button" onClick={() => setActiveTab(a => a + 1)} className="flex-[2] flex items-center justify-center gap-2 min-h-[56px] bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-md">
              Next <ArrowRight size={20} />
            </button>
          ) : (
            <button type="submit" className="flex-[2] flex items-center justify-center gap-2 min-h-[56px] bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-md disabled:opacity-50 text-lg">
              <Send size={24} /> Submit Response
            </button>
          )}
        </div>
      </form>
    </>
  );
}
