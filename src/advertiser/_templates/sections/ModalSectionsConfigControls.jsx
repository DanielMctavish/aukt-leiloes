const handleAddSection = () => {
    // Verifica se já existe uma seção do mesmo tipo com o mesmo selectedAuctId
    const existingSection = sections.find(section => 
        section.type === "GALLERY" && 
        section.config?.selectedAuctId === selectedAuctId
    );

    if (existingSection) {
        // Atualiza a seção existente
        const updatedSections = sections.map(section => {
            if (section.id === existingSection.id) {
                return {
                    ...section,
                    config: {
                        ...section.config,
                        selectedAuctId,
                        itemsPerRow: parseInt(itemsPerRow),
                        showTitle,
                        showPrice
                    }
                };
            }
            return section;
        });
        dispatch(updateSections(updatedSections));
    } else {
        // Adiciona uma nova seção
        const newSection = {
            id: uuidv4(),
            type: "GALLERY",
            config: {
                selectedAuctId,
                itemsPerRow: parseInt(itemsPerRow),
                showTitle,
                showPrice
            }
        };
        dispatch(updateSections([...sections, newSection]));
    }

    onClose();
}; 