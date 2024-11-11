/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Close, PhotoCamera, Title, LocalOffer, Category } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { handleImageChange } from "../functions/handleImageChange";
import { reportError } from "../../../features/errors/ReportErrorAtCreateAuct";
import CategorySelect from "./CategorySelect";

function DisplayCreateEvent() {
    const stateTheme = useSelector(state => state.theme)
    const [imageSrc, setImageSrc] = useState(null);
    const [tagList, setTagList] = useState([])
    const refMain = useRef()
    const refTitle = useRef()
    const refCategories = useRef()

    const dispatch = useDispatch()

    useEffect(() => {
        const cookieTheme = localStorage.getItem("dark-mode-advertiser-auct");
        if (cookieTheme === "true") {
            refMain.current.style.background = "#2d2d2d"
            refMain.current.style.color = "#efefef"
        } else {
            refMain.current.style.background = "#ffffff"
            refMain.current.style.color = "#595959"
        }
    }, [stateTheme])

  

    useEffect(() => {
        dispatch(addAuct({ tags: tagList }));
    }, [tagList])

    function HandleCreationTags(event) {
        const currentTag = event.target.value.split('')
        const currentWord = event.target.value
        const tagsInput = document.querySelector(".tags-input")

        if (currentTag[currentTag.length - 1] === ',') {
            const newTag = currentWord.split(",")[0];
            setTagList(prevArray => [...prevArray, newTag]);
            tagsInput.value = '';
        }
    }

    function HandleRemoveTag(tag) {
        setTagList(prevArray => {
            const newTags = prevArray.filter(item => item !== tag);
            return newTags;
        });
    }

    function handleDispatchTitle(e) {
        const newTitle = e.target.value;
        dispatch(addAuct({ title: newTitle }));
    }

    function handleDispatchCategories() {
        const newCategory = refCategories.current.value;
        if (newCategory === "" || !refTitle.current.value) {
            dispatch(reportError('Categorias do leilão são obrigatórias!'))
        } else {
            dispatch(reportError(false))
        }
        dispatch(addAuct({ categories: newCategory }));
    }

    return (
        <div ref={refMain} className="min-w-[30%] h-[100%] bg-white rounded-lg p-4
            hover:z-[77] hover:scale-[1.02] transition-all duration-300 ease-in-out
            shadow-xl shadow-[#00000020] relative overflow-y-auto">
            <h2 className="font-bold text-xl flex items-center gap-2 mb-6">
                <Title className="text-[#012038]" />
                Criação de Evento
            </h2>

            <section className="w-full flex flex-col gap-4 mb-6">
                <div className="w-full">
                    <span className="flex items-center gap-2 text-gray-700 mb-2">
                        <LocalOffer className="text-[#012038]" />
                        Título do leilão
                    </span>
                    <input 
                        onChange={handleDispatchTitle} 
                        ref={refTitle}
                        type="text"
                        className="w-full h-12 px-4 border border-gray-300 bg-transparent rounded-lg 
                        focus:ring-2 focus:ring-[#012038] focus:border-transparent transition-all
                        outline-none" 
                    />
                </div>
            </section>

            {/* TAGS */}
            <section className="w-full mb-6">
                <div className="w-full p-3 flex flex-wrap gap-2 min-h-[60px] 
                    bg-gray-50 rounded-lg mb-3">
                    {tagList.map((tag, index) => (
                        <span key={index} className="flex items-center gap-2 px-3 py-1.5 
                            bg-white rounded-full text-sm text-gray-700 shadow-sm">
                            {tag}
                            <Close 
                                onClick={() => HandleRemoveTag(tag)}
                                className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" 
                            />
                        </span>
                    ))}
                </div>
                <div className="w-full">
                    <span className="flex items-center gap-2 text-gray-700 mb-2">
                        <LocalOffer className="text-[#012038]" />
                        Tags
                    </span>
                    <input type="text"
                        placeholder="Digite as tags separando-as por vírgulas"
                        className="w-full h-12 px-4 border border-gray-300 bg-transparent rounded-lg
                        focus:ring-2 focus:ring-[#012038] focus:border-transparent transition-all
                        outline-none tags-input" 
                        onChange={HandleCreationTags} 
                    />
                </div>
            </section>

            {/* CATEGORIA */}
            <section className="w-full mb-6">
                <span className="flex items-center gap-2 text-gray-700 mb-2">
                    <Category className="text-[#012038]" />
                    Categoria do leilão
                </span>
                <CategorySelect handleDispatchCategories={handleDispatchCategories} refCategories={refCategories} />
            </section>

            {/* IMAGEM */}
            <section className="w-full">
                <label htmlFor="upload-auct-cover"
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg
                    flex flex-col justify-center items-center cursor-pointer
                    hover:border-[#012038] transition-colors">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Capa do leilão" 
                            className="w-full h-full object-cover rounded-lg" 
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                            <PhotoCamera style={{ fontSize: '48px' }} className="text-[#012038]" />
                            <p className="text-sm">Clique para selecionar uma imagem</p>
                        </div>
                    )}
                </label>
                <input
                    type="file"
                    id="upload-auct-cover"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, setImageSrc)}
                />
            </section>
        </div>
    )
}

export default DisplayCreateEvent;