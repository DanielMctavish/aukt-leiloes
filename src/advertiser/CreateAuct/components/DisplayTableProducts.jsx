/* eslint-disable react-hooks/exhaustive-deps */
import "./styles/StylesTables.css"
import { ArrowDropDown } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { HomeMax } from "@mui/icons-material"

function DisplayTableProducts() {
    const state = useSelector(state => state.products.products)
    const [products, setProducts] = useState({ columns: [], values: [] })
    const refMessage = useRef()

    useEffect(() => {
        //console.log("observando estado tabelas -> ", state.values);
        setProducts(state)
    }, [state])

    //VALIDAR CAMPOS DO TOPO........................................................................................................................
    const validateMainColumns = (column, index) => {
        //console.log('observando colunas state -> ', state.columns.length);

        if (products.columns.length < 10) {

            refMessage.current.style.display = 'flex'
            refMessage.current.innerHTML = 'São necessárias 10 colunas de informações'

            return false
        } else {
            refMessage.current.style.display = 'none'
        }

        return (
            <span key={index} className="p-2 text-zinc-600 font-semibold flex gap-2 bg-slate-300 min-w-[200px] justify-between">
                <span>{column}</span>
                <ArrowDropDown />
            </span>
        )
    }

    //VALIDAR VALORES DOS CAMPOS..................................................................................................................
    const validateFields = (field, index) => {
        let tailwindCode = "p-2 text-left text-[14px] font-bold bg-stone-400/10 min-w-[200px] min-h-[100px] rounded-md max-h-[100px] overflow-y-auto justify-between"

        if (index === 3 || index === 4 || index === 5 || index === 7 || index === 8) {

            if (field < 0) {
                tailwindCode = "p-2 text-left text-[14px] font-bold min-w-[200px] justify-between span-error"
                refMessage.current.style.display = 'flex'
                refMessage.current.innerHTML = 'os valores não podem negativos'
            } else if (typeof field !== 'number') {
                tailwindCode = "p-2 text-left text-[14px] font-bold bg-red-400/30 min-w-[200px] justify-between span-error"
                refMessage.current.style.display = 'flex'
                refMessage.current.innerHTML = 'os campos em vermelho precisam ser números'
            }

        }

        return (
            <span key={index} className={tailwindCode}>
                {field}
            </span>
        )
    }

    // Maximizar tabela

    const refTableWindow = useRef()
    const handleMaximizeWindow = () => {
        refTableWindow.current.style.display = "absolute"
        refTableWindow.current.style.width = '60%'
        refTableWindow.current.style.height = '30%'

        setTimeout(() => {
            refTableWindow.current.style.transition = '2s'
            refTableWindow.current.style.width = '84%'
            refTableWindow.current.style.height = '88%'
            refTableWindow.current.style.position = "fixed"

        }, 100);

    }

    return (
        <div ref={refTableWindow} className="bg-white w-full rounded-md  shadow-md shadow-[#1b1b1b2a] relative z-[99] overflow-y-auto">
            <span className="w-[100%] min-h-[40px] flex bg-zinc-600 relative">
                <button onClick={handleMaximizeWindow} className="absolute right-2 top-1 cursor-pointer text-white">
                    <HomeMax />
                </button>
                <span ref={refMessage} className="w-full min-h-[40px] p-1 justify-start items-center text-red-200 text-[12px] hidden">mensagem</span>
            </span>

            <div>
                <div className="w-full h-max-[100px] flex gap-1">

                    {products.columns.map((column, index) => validateMainColumns(column, index))}

                </div>

                <div className="w-full flex flex-col gap-1">

                    {products.values.map((value, index) => (

                        <div className="w-full flex justify-between items-center gap-1" key={index}>
                            {value.map(((field, index) => validateFields(field, index)))}
                        </div>

                    ))}

                </div>
            </div>
        </div>
    )
}

export default DisplayTableProducts