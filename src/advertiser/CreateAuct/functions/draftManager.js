export const saveDraft = (data) => {
    const currentDraft = loadDraft() || {};
    const updatedDraft = {
        ...currentDraft,
        ...data,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('auct-draft', JSON.stringify(updatedDraft));
};

export const loadDraft = () => {
    const draft = localStorage.getItem('auct-draft');
    return draft ? JSON.parse(draft) : null;
};

export const clearDraft = () => {
    localStorage.removeItem('auct-draft');
};

export const autoSaveDraft = (data) => {
    if (window.autoSaveTimeout) {
        clearTimeout(window.autoSaveTimeout);
    }
    window.autoSaveTimeout = setTimeout(() => {
        const currentDraft = loadDraft() || {};
        saveDraft({
            ...currentDraft,
            ...data
        });
    }, 500);
}; 