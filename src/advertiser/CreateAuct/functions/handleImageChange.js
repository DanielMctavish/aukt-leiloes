let currentFile

export const handleImageChange = (e, setImageSrc) => {
    currentFile = e.target.files[0];

    if (currentFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setImageSrc(e.target.result);
        };
        reader.readAsDataURL(currentFile);
    }

};

export const getCurrentFile = () => {
    return currentFile;
};