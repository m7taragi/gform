"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Save, Trash2, FolderPlus, ListPlus, LayoutTemplate, Settings2, Grid, CheckSquare, Edit, X } from "lucide-react";
import { createFormAction } from "../app/actions/form";
import { saveSectionTemplateAction, getSectionTemplatesAction } from "../app/actions/template";
import { getMasterDataListsAction } from "../app/actions/masterData";

// Modal Component for Editing a single question
function QuestionModal({ q, updateQuestion, onClose, masterDataLists, availableDependencyQuestions }) {
  const isSection = q.dataType === "section";
  const isMatrix = q.dataType === "matrix";
  const [showLogic, setShowLogic] = useState(!!q.showIf);
  
  const parseShowIf = () => {
    try {
      return q.showIf ? JSON.parse(q.showIf) : { dependsOnId: "", operator: "equals", value: "" };
    } catch {
      return { dependsOnId: "", operator: "equals", value: "" };
    }
  };
  
  const handleLogicChange = (field, value) => {
    const current = parseShowIf();
    current[field] = value;
    if (!current.dependsOnId) {
      updateQuestion(q.id, "showIf", null);
    } else {
      updateQuestion(q.id, "showIf", JSON.stringify(current));
    }
  };
  
  const currentLogic = parseShowIf();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant">
          <h2 className="text-xl font-bold">Configure {isSection ? "Section" : isMatrix ? "Matrix" : "Column / Question"}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X size={20}/></button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Short Column Heading (Table Header)</label>
            <input
              type="text"
              className="w-full min-h-[48px] px-4 py-2 bg-surface-bright border border-outline rounded-md"
              placeholder="e.g. Department"
              value={q.shortHeading || ""}
              onChange={(e) => updateQuestion(q.id, "shortHeading", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Question Text / Description (Hover Tooltip)</label>
            <input
              type="text"
              className="w-full min-h-[48px] px-4 py-2 bg-surface-bright border border-outline rounded-md"
              placeholder="Full text..."
              value={q.questionText || ""}
              onChange={(e) => updateQuestion(q.id, "questionText", e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Data Type</label>
              <select
                className="w-full min-h-[48px] px-4 py-2 bg-surface-bright border border-outline rounded-md"
                value={q.dataType}
                onChange={(e) => updateQuestion(q.id, "dataType", e.target.value)}
              >
                <option value="section">Section (Column Group)</option>
                <option value="text">Text (Short Answer)</option>
                <option value="long_text">Long Text (Paragraph)</option>
                <option value="number">Number</option>
                <option value="boolean">Yes / No (Boolean)</option>
                <option value="date">Date</option>
                <option value="single_choice">Dropdown (Single Choice)</option>
                <option value="multiple_choice">Checkboxes (Multiple Choice)</option>
                <option value="rating">Rating (1-5)</option>
                <option value="location">Location / Address</option>
                <option value="master_data">Master Data List</option>
                <option value="matrix">Matrix Grid</option>
              </select>
            </div>

            {!isSection && (
              <div className="flex items-center space-x-3 flex-1 pt-6">
                <input
                  type="checkbox"
                  id="isRequired"
                  className="w-6 h-6 text-primary rounded border-outline"
                  checked={q.isRequired || false}
                  onChange={(e) => updateQuestion(q.id, "isRequired", e.target.checked)}
                />
                <label className="text-sm font-medium" htmlFor="isRequired">Required Field</label>
              </div>
            )}
          </div>

          {(q.dataType === "single_choice" || q.dataType === "multiple_choice" || q.dataType === "matrix") && (
            <div className="mt-4 border-t border-outline-variant pt-4">
              <label className="block text-sm font-medium mb-1">Options (Enter one per line)</label>
              <textarea
                className="w-full min-h-[96px] px-4 py-2 bg-surface-bright border border-outline rounded-md"
                value={q.options || ""}
                onChange={(e) => updateQuestion(q.id, "options", e.target.value)}
              />
            </div>
          )}

          {q.dataType === "master_data" && (
            <div className="mt-4 border-t border-outline-variant pt-4">
              <label className="block text-sm font-medium mb-1">Select Master Data Source</label>
              <select
                className="w-full min-h-[48px] px-4 py-2 bg-surface-bright border border-outline rounded-md"
                value={q.options || ""}
                onChange={(e) => updateQuestion(q.id, "options", e.target.value)}
              >
                <option value="" disabled>-- Select a List --</option>
                {masterDataLists.map((md) => (
                  <option key={md.id} value={md.id}>{md.name}</option>
                ))}
              </select>
            </div>
          )}

          {isSection && (
            <div className="flex items-center space-x-3 pt-4 border-t border-outline-variant">
              <input
                type="checkbox"
                id="isRepeatable"
                className="w-6 h-6 text-primary rounded border-outline"
                checked={q.isRepeatable || false}
                onChange={(e) => updateQuestion(q.id, "isRepeatable", e.target.checked)}
              />
              <label className="text-sm font-medium" htmlFor="isRepeatable">Allow user to add multiple instances of this section</label>
            </div>
          )}

          <div className="pt-4 border-t border-outline-variant">
             <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={showLogic} onChange={e => setShowLogic(e.target.checked)} className="w-5 h-5 text-primary"/>
                <span className="font-bold">Enable Conditional Display Logic</span>
             </label>
             {showLogic && (
               <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-4">
                 <div className="flex flex-col sm:flex-row gap-2">
                   <select 
                     className="flex-1 p-2 bg-surface border border-outline rounded-md"
                     value={currentLogic.dependsOnId}
                     onChange={(e) => handleLogicChange("dependsOnId", e.target.value)}
                   >
                     <option value="">-- Always Show --</option>
                     {availableDependencyQuestions.map(other => (
                       <option key={other.id} value={other.id}>{other.shortHeading || other.questionText}</option>
                     ))}
                   </select>
                   {currentLogic.dependsOnId && (
                     <>
                       <select 
                         className="w-32 p-2 bg-surface border border-outline rounded-md"
                         value={currentLogic.operator}
                         onChange={(e) => handleLogicChange("operator", e.target.value)}
                       >
                         <option value="equals">Equals</option>
                         <option value="not_equals">Not Equals</option>
                       </select>
                       <input 
                         type="text"
                         className="flex-1 p-2 bg-surface border border-outline rounded-md"
                         placeholder="Value..."
                         value={currentLogic.value}
                         onChange={(e) => handleLogicChange("value", e.target.value)}
                       />
                     </>
                   )}
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant bg-surface-bright flex justify-end">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-primary text-on-primary font-bold rounded-md hover:brightness-110">Save & Close Modal</button>
        </div>
      </div>
    </div>
  );
}

export function FormBuilder() {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    isPublic: true,
    isActive: true,
    limitOneResponse: false,
    customSubmitMessage: "",
    layout: "single_page",
    questions: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [templates, setTemplates] = useState([]);
  const [masterDataLists, setMasterDataLists] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // New State for Editor Modal
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  useEffect(() => {
    getSectionTemplatesAction().then(res => {
      if (res.success) setTemplates(res.templates);
    });
    getMasterDataListsAction().then(res => {
      if (res.success) setMasterDataLists(res.lists);
    });
  }, []);

  const addQuestion = (parentId = null, dataType = "text") => {
    const newId = crypto.randomUUID();
    setFormState((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: newId,
          parentId,
          shortHeading: "",
          questionText: "",
          dataType,
          options: "",
          showIf: null,
          isRequired: false,
          isRepeatable: false,
          sortOrder: prev.questions.length,
        },
      ],
    }));
    setEditingQuestionId(newId); // Instantly open modal for the new question
  };

  const updateQuestion = (id, field, value) => {
    setFormState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));
  };

  const removeQuestion = (id) => {
    const getIdsToRemove = (targetId, currentQuestions) => {
      const children = currentQuestions.filter(q => q.parentId === targetId);
      let ids = [targetId];
      for (const child of children) {
         ids = [...ids, ...getIdsToRemove(child.id, currentQuestions)];
      }
      return ids;
    };
    if(window.confirm("Are you sure you want to delete this row and all its nested children?")) {
      setFormState((prev) => {
        const idsToRemove = getIdsToRemove(id, prev.questions);
        return {
          ...prev,
          questions: prev.questions.filter((q) => !idsToRemove.includes(q.id)),
        };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      const result = await createFormAction(formState);
      if (result.success) {
        setMessage({ type: "success", text: "Grid Form successfully saved to the database!" });
        setFormState({ title: "", description: "", isPublic: true, isActive: true, limitOneResponse: false, customSubmitMessage: "", layout: "single_page", questions: [] });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save form." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "A network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Flatten the recursive structure for Data Table rendering
  const getFlattenedQuestions = (parentId, level) => {
    let flat = [];
    const children = formState.questions.filter(q => q.parentId === parentId);
    children.forEach(c => {
      flat.push({ ...c, level });
      flat = flat.concat(getFlattenedQuestions(c.id, level + 1));
    });
    return flat;
  };

  const flattenedQuestions = getFlattenedQuestions(null, 0);
  const editingQuestion = formState.questions.find(q => q.id === editingQuestionId);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      {editingQuestion && (
        <QuestionModal 
          q={editingQuestion} 
          updateQuestion={updateQuestion} 
          onClose={() => setEditingQuestionId(null)}
          masterDataLists={masterDataLists}
          availableDependencyQuestions={formState.questions.filter(q => q.id !== editingQuestionId && q.dataType !== 'section' && q.dataType !== 'matrix')}
        />
      )}

      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Report (Grid Builder)</h1>
          <p className="text-on-surface-variant">Define your report's column headers and sections.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Report Title</label>
              <input type="text" required className="w-full px-4 py-2 bg-surface-bright border border-outline rounded-md" value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <textarea className="w-full px-4 py-2 bg-surface-bright border border-outline rounded-md min-h-[64px]" value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} />
            </div>

            <div className="flex flex-col gap-6 pt-4 border-t border-outline-variant mt-4">
              <h3 className="font-bold text-lg">Settings</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="w-6 h-6 text-primary rounded border-outline" checked={formState.isActive} onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })} />
                  <span className="text-sm font-medium">Accepting Responses</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="w-6 h-6 text-primary rounded border-outline" checked={formState.limitOneResponse} onChange={(e) => setFormState({ ...formState, limitOneResponse: e.target.checked })} />
                  <span className="text-sm font-medium">Limit to 1 response (Requires Login)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Grid Architecture</h2>
            <div className="flex gap-2">
              <button type="button" onClick={() => addQuestion(null, "text")} className="flex items-center gap-1 bg-primary text-on-primary px-3 py-2 rounded-md font-bold text-sm hover:brightness-110"><PlusCircle size={16}/> Add Column</button>
              <button type="button" onClick={() => addQuestion(null, "section")} className="flex items-center gap-1 bg-secondary text-on-secondary px-3 py-2 rounded-md font-bold text-sm hover:brightness-110"><FolderPlus size={16}/> Add Section Group</button>
            </div>
          </div>
          
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-variant text-on-surface-variant">
                <tr>
                  <th className="p-4 font-semibold w-1/2">Header Name</th>
                  <th className="p-4 font-semibold">Data Type</th>
                  <th className="p-4 font-semibold text-center">Required</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flattenedQuestions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-on-surface-variant italic">No columns defined yet. Add a section or column to begin.</td>
                  </tr>
                ) : (
                  flattenedQuestions.map((q) => {
                    const isSection = q.dataType === "section";
                    return (
                      <tr key={q.id} className={`border-t border-outline-variant hover:bg-surface-variant/30 transition-colors ${isSection ? 'bg-primary/5 font-bold' : ''}`}>
                        <td className="p-4" style={{ paddingLeft: `${q.level * 2 + 1}rem` }}>
                           <div className="flex flex-col group cursor-help" title={q.questionText}>
                              <span className="flex items-center gap-2">
                                {isSection ? <FolderPlus size={16} className="text-primary"/> : <Grid size={16} className="text-on-surface-variant"/>}
                                {q.shortHeading || q.questionText || (isSection ? "Untitled Section" : "Untitled Column")}
                              </span>
                              {!isSection && q.questionText && <span className="text-xs text-on-surface-variant font-normal opacity-0 group-hover:opacity-100 transition-opacity">Full text: {q.questionText}</span>}
                           </div>
                        </td>
                        <td className="p-4 text-sm">
                           <span className="bg-surface-bright px-2 py-1 rounded text-on-surface border border-outline-variant inline-block">{q.dataType.replace('_', ' ')}</span>
                        </td>
                        <td className="p-4 text-center text-sm">{!isSection && (q.isRequired ? "✅" : "❌")}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {isSection && <button type="button" onClick={() => addQuestion(q.id, "text")} className="p-1.5 text-secondary hover:bg-secondary-container rounded" title="Add Column Inside"><ListPlus size={16}/></button>}
                            <button type="button" onClick={() => setEditingQuestionId(q.id)} className="p-1.5 text-primary hover:bg-primary-container rounded" title="Edit Properties"><Edit size={16}/></button>
                            <button type="button" onClick={() => removeQuestion(q.id)} className="p-1.5 text-error hover:bg-error-container rounded" title="Delete Row"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-8 flex justify-end gap-4 border-t border-outline-variant">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-primary text-on-primary font-bold px-8 py-4 rounded-xl hover:brightness-110 shadow-lg text-lg">
            <Save size={24} /> {isSubmitting ? "Saving Grid..." : "Save Grid Architecture"}
          </button>
        </div>
        
        {message && (
          <div className={`mt-4 p-4 font-bold rounded-lg text-center ${message.type === 'success' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#c5221f]'}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
