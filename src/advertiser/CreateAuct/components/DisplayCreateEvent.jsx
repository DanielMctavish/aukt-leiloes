/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Close, PhotoCamera } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { handleImageChange } from "../functions/handleImageChange";
import { reportError } from "../../../features/errors/ReportErrorAtCreateAuct";
import CategorySelect from "./CategorySelect";

function DisplayCreateEvent({ currentAuct }) {
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
            console.log("ligado")
            refMain.current.style.background = "#2d2d2d"
            refMain.current.style.color = "#efefef"
        } else {
            console.log("desligado")
            refMain.current.style.background = "#ffffff"
            refMain.current.style.color = "#595959"
        }

    }, [stateTheme])


    useEffect(() => {

        if (currentAuct) {
            refTitle.current.value = currentAuct.title
            refCategories.current.value = currentAuct.categorie
            setTagList(currentAuct.tags)
            setImageSrc(currentAuct.auct_cover_img)

            dispatch(addAuct({
                title: currentAuct.title,
                categorie: currentAuct.categorie,
                tags: currentAuct.tags,
                auct_cover_img: currentAuct.auct_cover_img
            }))
        }

        if (!refTitle.current.value || !refCategories.current.value) {
            dispatch(reportError('Todos os campos são obrigatórios!'))
        }

    }, [])

    useEffect(() => {
        dispatch(addAuct({ tags: tagList }));
    }, [tagList])


    //REGISTRANDO TAGS PARA UMA LISTA

    function HandleCreationTags(event) {
        const currentTag = event.target.value.split('')
        const currentWord = event.target.value
        const tagsInput = document.querySelector(".tags-input")

        if (currentTag[currentTag.length - 1] === ',') {
            //console.log('tag encontrada -> ', currentWord.split(",")[0]);
            setTagList(prevArray => [...prevArray, currentWord.split(",")[0]])
            tagsInput.value = ''
        }

    }

    function HandleRemoveTag(tag) {
        //console.log('tag a ser deletada --> ', tag);
        setTagList(prevArray => prevArray.filter(item => item !== tag));
        dispatch(addAuct({ tags: tagList }));
    }

    function handleDispatchTitle() {

        dispatch(addAuct({ title: refTitle.current.value }));

        if (!refTitle.current.value || !refCategories.current.value) {
            dispatch(reportError('Título do leilão é obrigatório!'))
        } else {
            dispatch(reportError(false))
        }

    }

    function handleDispatchCategories() {

        if (refCategories.current.value === "" || !refTitle.current.value) {
            dispatch(reportError('Categorias do leilão são obrigatórias!'))
        } else {
            dispatch(reportError(false))
        }

        dispatch(addAuct({ categories: refCategories.current.value }));

    }



    return (
        <div ref={refMain} className="min-w-[30%] h-[100%] bg-white rounded-md p-2
        hover:z-[77] hover:scale-[1.02] transition-[1s]  overflow-y-auto
        shadow-2xl shadow-[#00000039] relative">
            <h2 className="font-bold absolute left-2 top-2">Criação de Evento</h2>

            <section className="w-full h-[20%] flex flex-col gap-2 justify-center items-center mt-4">
                <div className="w-[80%] flex flex-col gap-3">
                    <span>Títullo do leilão</span>
                    <input onChange={handleDispatchTitle} ref={refTitle}
                        type="text"
                        className="w-full h-[40px] p-2 border-[1px] border-zinc-300 bg-transparent rounded-md" />
                </div>
            </section>
            {/* TAGS */}
            <section className="w-full h-[20%] flex flex-col gap-2 justify-center items-center mt-6">
                <div className="w-[80%] flex-wrap p-2 gap-2 flex justify-start items-center 
                text-[12px] min-h-[60px] overflow-y-auto mt-3 bg-[#ebebeb] rounded-md">
                    {
                        tagList.map((tag, index) => (
                            <span key={index} className="font-light italic text-zinc-600 
                            flex justify-center gap-3 bg-zinc-200 p-1 rounded-md ">
                                {tag}
                                <span onClick={() => { HandleRemoveTag(tag) }}>
                                    <Close className="cursor-pointer" style={{ fontSize: '16px' }} />
                                </span>
                            </span>
                        ))
                    }
                </div>
                <div className="w-[80%] flex flex-col gap-3">
                    <span>Tags</span>
                    <input type="text"
                        placeholder="digite as tags separando-as por vírgulas"
                        className="p-2 text-[#3d3d3d] tags-input rounded-md 
                    bg-transparent  border-[1px] border-zinc-300" onChange={HandleCreationTags} />
                </div>
            </section>
            {/* CATEGORIA */}
            <CategorySelect handleDispatchCategories={handleDispatchCategories} refCategories={refCategories} />

            <section className="w-full h-[30%] flex flex-col gap-2 justify-center items-center mt-6">
                <label htmlFor="upload-auct-cover"
                    className="w-full h-[20vh] 
                                border-[1px] border-zinc-300 
                                rounded-lg flex justify-center 
                                items-center cursor-pointer">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Capa do leilão" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <div>
                            <PhotoCamera style={{ fontSize: '60px' }} />
                            <p>Selecione uma imagem</p>
                        </div>
                    )}
                </label>
                <input
                    type="file"
                    id="upload-auct-cover"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageChange(e, setImageSrc)}
                />
            </section>

        </div>
    )
}

export default DisplayCreateEvent;