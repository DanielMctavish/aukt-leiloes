/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Close, PhotoCamera } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { handleImageChange } from "../functions/handleImageChange";

function DisplayCreateEvent({ currentAuct }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [tagList, setTagList] = useState([])
    const refTitle = useRef()
    const refCategories = useRef()

    const dispatch = useDispatch()

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
    }
    function handleDispatchCategories() {
        dispatch(addAuct({ categories: refCategories.current.value }));
    }



    return (
        <div className="min-w-[30%] h-[100%] bg-white rounded-md p-2
        hover:z-[77] hover:scale-[1.02] transition-[1s]  overflow-y-auto
        shadow-2xl shadow-[#00000039] relative">
            <h2 className="font-bold absolute left-2 top-2">Criação de Evento</h2>

            <section className="w-full h-[20%] flex flex-col gap-2 justify-center items-center mt-4">
                <div className="w-[80%] flex flex-col gap-3">
                    <span>Títullo do leilão</span>
                    <input onChange={handleDispatchTitle} ref={refTitle}
                        type="text"
                        className="w-full h-[40px] p-2 border-[1px] border-zinc-300 bg-transparent" />
                </div>
            </section>
            {/* TAGS */}
            <section className="w-full h-[20%] flex flex-col gap-2 justify-center items-center mt-6">
                <div className="w-[80%] flex-wrap p-2 gap-2 flex justify-start items-start text-[12px] min-h-[70px] overflow-y-auto mt-3">
                    {
                        tagList.map((tag, index) => (
                            <span key={index} className="font-light italic text-zinc-600 flex justify-center gap-3 bg-zinc-200 p-1 rounded-md">
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
                    <input type="text" className="p-2 text-white tags-input" onChange={HandleCreationTags} />
                </div>
            </section>
            {/* CATEGORIA */}
            <section className="w-full h-[26%] flex flex-col gap-2 justify-center items-center mt-6">
                <div className="w-[80%] flex flex-col gap-3">
                    <span>Categoria do leilão</span>
                    <select onChange={handleDispatchCategories}
                        ref={refCategories}
                        defaultValue={refCategories.current ? refCategories.current.value : ""}
                        className="w-full bg-transparent h-[40px] p-2 border-[1px] border-zinc-300">
                        <option value="">selecione</option>
                        <option value="Abajur">Abajur</option>
                        <option value="Acessórios femininos">Acessórios femininos</option>
                        <option value="Álbum">Álbum</option>
                        <option value="Aparador">Aparador</option>
                        <option value="Aquarelas / Guaches">Aquarelas / Guaches</option>
                        <option value="Armário">Armário</option>
                        <option value="Arquitetura">Arquitetura</option>
                        <option value="Arranjos">Arranjos</option>
                        <option value="Arte africana">Arte africana</option>
                        <option value="Arte de mesa">Arte de mesa</option>
                        <option value="Arte erótica">Arte erótica</option>
                        <option value="Arte indígena">Arte indígena</option>
                        <option value="Arte oriental">Arte oriental</option>
                        <option value="Arte popular">Arte popular</option>
                        <option value="Arte sacra">Arte sacra</option>
                        <option value="Artefatos da antiguidade">Artefatos da antiguidade</option>
                        <option value="Autógrafos">Autógrafos</option>
                        <option value="Automodelismo">Automodelismo</option>
                        <option value="Azulejo">Azulejo</option>
                        <option value="Banco">Banco</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Bengala">Bengala</option>
                        <option value="Bibliografias">Bibliografias</option>
                        <option value="Bijuterias">Bijuterias</option>
                        <option value="Brasil Império">Brasil Império</option>
                        <option value="Brinquedos">Brinquedos</option>
                        <option value="Brinquedos antigos">Brinquedos antigos</option>
                        <option value="Bronze">Bronze</option>
                        <option value="Cadeira">Cadeira</option>
                        <option value="Cama">Cama</option>
                        <option value="Cama, mesa e banho">Cama, mesa e banho</option>
                        <option value="Candelabro / Castiçal">Candelabro / Castiçal</option>
                        <option value="Canetas">Canetas</option>
                        <option value="Cartofilia">Cartofilia</option>
                        <option value="Cartografia">Cartografia</option>
                        <option value="Catálogos">Catálogos</option>
                        <option value="Cerâmica">Cerâmica</option>
                        <option value="Chaveiros">Chaveiros</option>
                        <option value="Cheques antigos">Cheques antigos</option>
                        <option value="Cinema">Cinema</option>
                        <option value="Cobre">Cobre</option>
                        <option value="Colecionismo">Colecionismo</option>
                        <option value="Cristais">Cristais</option>
                        <option value="Cristais / Vidros">Cristais / Vidros</option>
                        <option value="Crítica literária">Crítica literária</option>
                        <option value="Curiosidade">Curiosidade</option>
                        <option value="Cutelaria / Facas">Cutelaria / Facas</option>
                        <option value="Demolição">Demolição</option>
                        <option value="Desenhos & caricaturas">Desenhos & caricaturas</option>
                        <option value="Design industrial">Design industrial</option>
                        <option value="Dicionários">Dicionários</option>
                        <option value="Disco de vinil">Disco de vinil</option>
                        <option value="Diversos">Diversos</option>
                        <option value="Documentos">Documentos</option>
                        <option value="Eletrônicos">Eletrônicos</option>
                        <option value="Equipamentos">Equipamentos</option>
                        <option value="Equipamentos de cozinha">Equipamentos de cozinha</option>
                        <option value="Esculturas">Esculturas</option>
                        <option value="Espelhos">Espelhos</option>
                        <option value="Esporte">Esporte</option>
                        <option value="Estanho">Estanho</option>
                        <option value="Estante">Estante</option>
                        <option value="Faiança">Faiança</option>
                        <option value="Faqueiros">Faqueiros</option>
                        <option value="Ferramentas">Ferramentas</option>
                        <option value="Filatelia">Filatelia</option>
                        <option value="Filatelia Brasileira">Filatelia Brasileira</option>
                        <option value="Filatelia estrangeira">Filatelia estrangeira</option>
                        <option value="Filatelia Fiscal">Filatelia Fiscal</option>
                        <option value="Flâmulas">Flâmulas</option>
                        <option value="Fotografia">Fotografia</option>
                        <option value="Futebol / Copa do Mundo">Futebol / Copa do Mundo</option>
                        <option value="Gibi / Quadrinhos">Gibi / Quadrinhos</option>
                        <option value="Gravuras">Gravuras</option>
                        <option value="Guerras">Guerras</option>
                        <option value="História">História</option>
                        <option value="Ícone">Ícone</option>
                        <option value="Iconografia">Iconografia</option>
                        <option value="Imagens">Imagens</option>
                        <option value="Imóveis">Imóveis</option>
                        <option value="Incunábulo">Incunábulo</option>
                        <option value="Indumentária">Indumentária</option>
                        <option value="Informática">Informática</option>
                        <option value="Instalação">Instalação</option>
                        <option value="Instrumentos musicais">Instrumentos musicais</option>
                        <option value="Instrumentos ópticos">Instrumentos ópticos</option>
                        <option value="Itens automobilisticos">Itens automobilisticos</option>
                        <option value="Joias">Joias</option>
                        <option value="Jornais e afins">Jornais e afins</option>
                        <option value="Leque">Leque</option>
                        <option value="Linoleogravura">Linoleogravura</option>
                        <option value="Litografia">Litografia</option>
                        <option value="Litogravura">Litogravura</option>
                        <option value="Livros">Livros</option>
                        <option value="Livros - Arquitetura">Livros - Arquitetura</option>
                        <option value="Livros - Artes">Livros - Artes</option>
                        <option value="Livros - Biografias">Livros - Biografias</option>
                        <option value="Livros - Colecionismo">Livros - Colecionismo</option>
                        <option value="Livros - Design">Livros - Design</option>
                        <option value="Livros - Direito">Livros - Direito</option>
                        <option value="Livros - Economia">Livros - Economia</option>
                        <option value="Livros - Enciclopédia">Livros - Enciclopédia</option>
                        <option value="Livros - Filosofia">Livros - Filosofia</option>
                        <option value="Livros - Folclore">Livros - Folclore</option>
                        <option value="Livros - Fotografia">Livros - Fotografia</option>
                        <option value="Livros - Gastronomia">Livros - Gastronomia</option>
                        <option value="Livros - História">Livros - História</option>
                        <option value="Livros - Literatura brasileira">Livros - Literatura brasileira</option>
                        <option value="Livros - Literatura estrangeira">Livros - Literatura estrangeira</option>
                        <option value="Livros - Literatura infantil">Livros - Literatura infantil</option>
                        <option value="Livros - Moda">Livros - Moda</option>
                        <option value="Livros - Raros">Livros - Raros</option>
                        <option value="Livros - Religiosos">Livros - Religiosos</option>
                        <option value="Livros - Sociologia & Antropologia">Livros - Sociologia & Antropologia</option>
                        <option value="Luminárias">Luminárias</option>
                        <option value="Lustres">Lustres</option>
                        <option value="Manuscritos & Autógrafos">Manuscritos & Autógrafos</option>
                        <option value="Máquinas / Motores">Máquinas / Motores</option>
                        <option value="Marfim">Marfim</option>
                        <option value="Mármore">Mármore</option>
                        <option value="Material de construção">Material de construção</option>
                        <option value="Medalha">Medalha</option>
                        <option value="Memorabilia">Memorabilia</option>
                        <option value="Memorabilia & Efêmera">Memorabilia & Efêmera</option>
                        <option value="Memorabilia fumageira">Memorabilia fumageira</option>
                        <option value="Mesa">Mesa</option>
                        <option value="Mesa Auxiliar">Mesa Auxiliar</option>
                        <option value="Mesa de Centro">Mesa de Centro</option>
                        <option value="Mesa Desk">Mesa Desk</option>
                        <option value="Metais Nobres">Metais Nobres</option>
                        <option value="Metal Dourado">Metal Dourado</option>
                        <option value="Metal Prateado">Metal Prateado</option>
                        <option value="Mídias">Mídias</option>
                        <option value="Militaria">Militaria</option>
                        <option value="Miniaturas">Miniaturas</option>
                        <option value="Mobiliário">Mobiliário</option>
                        <option value="Moda e Acessórios">Moda e Acessórios</option>
                        <option value="Móveis">Móveis</option>
                        <option value="Murano">Murano</option>
                        <option value="Música">Música</option>
                        <option value="NFT">NFT</option>
                        <option value="Numismática - Ações/Apólices">Numismática - Ações/Apólices</option>
                        <option value="Numismática - Cédulas">Numismática - Cédulas</option>
                        <option value="Numismática - Cédulas Brasileiras">Numismática - Cédulas Brasileiras</option>
                        <option value="Numismática - Cédulas Estrangeiras">Numismática - Cédulas Estrangeiras</option>
                        <option value="Numismática - Condecorações">Numismática - Condecorações</option>
                        <option value="Numismática - Exonúmia etc">Numismática - Exonúmia etc</option>
                        <option value="Numismática - Fichas/Tokens/Jetons">Numismática - Fichas/Tokens/Jetons</option>
                        <option value="Numismática - Medalhas">Numismática - Medalhas</option>
                        <option value="Numismática - Moeda Bizantina">Numismática - Moeda Bizantina</option>
                        <option value="Numismática - Moeda Grega">Numismática - Moeda Grega</option>
                        <option value="Numismática - Moeda Medieval">Numismática - Moeda Medieval</option>
                        <option value="Numismática - Moeda Romana">Numismática - Moeda Romana</option>
                        <option value="Numismática - Moedas">Numismática - Moedas</option>
                        <option value="Numismática - Moedas do Brasil">Numismática - Moedas do Brasil</option>
                        <option value="Objetos Decorativos">Objetos Decorativos</option>
                        <option value="Opalina">Opalina</option>
                        <option value="Ouro">Ouro</option>
                        <option value="Paisagismo">Paisagismo</option>
                        <option value="Pedras Preciosas">Pedras Preciosas</option>
                        <option value="Perfume / Perfumeiros">Perfume / Perfumeiros</option>
                        <option value="Pintura">Pintura</option>
                        <option value="Pinturas e Gravuras">Pinturas e Gravuras</option>
                        <option value="Política">Política</option>
                        <option value="Poltrona">Poltrona</option>
                        <option value="Porcelana">Porcelana</option>
                        <option value="Porcelanas / Cerâmicas">Porcelanas / Cerâmicas</option>
                        <option value="Postais">Postais</option>
                        <option value="Posters">Posters</option>
                        <option value="Prata de Lei">Prata de Lei</option>
                        <option value="Pratas">Pratas</option>
                        <option value="Propaganda">Propaganda</option>
                        <option value="Publicidade">Publicidade</option>
                        <option value="Quadros">Quadros</option>
                        <option value="Religião">Religião</option>
                        <option value="Relógio">Relógio</option>
                        <option value="Reproduções">Reproduções</option>
                        <option value="Revista">Revista</option>
                        <option value="Semi jóias">Semi jóias</option>
                        <option value="Serigrafias">Serigrafias</option>
                        <option value="Sofá">Sofá</option>
                        <option value="Som">Som</option>
                        <option value="Sucata">Sucata</option>
                        <option value="Tapeçaria">Tapeçaria</option>
                        <option value="Tapetes">Tapetes</option>
                        <option value="Taxidermia">Taxidermia</option>
                        <option value="Telecartofilia">Telecartofilia</option>
                        <option value="Vaso">Vaso</option>
                        <option value="Veículos">Veículos</option>
                        <option value="Viajantes">Viajantes</option>
                        <option value="Video Games">Video Games</option>
                        <option value="Vidro">Vidro</option>
                        <option value="Xilogravura">Xilogravura</option>

                    </select>
                </div>
            </section>

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