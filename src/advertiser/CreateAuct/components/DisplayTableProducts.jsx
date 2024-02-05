/* eslint-disable react-hooks/exhaustive-deps */
import "./styles/StylesTables.css"
import { ArrowDropDown } from "@mui/icons-material";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function DisplayTableProducts() {
    const state = useSelector(state => state.products.products)
    const refMessage = useRef()

    useEffect(() => {
        //console.log("observando estado tabelas -> ", state.values);
    }, [state.products])

    //VALIDAR CAMPOS DO TOPO........................................................................................................................
    const validateMainColumns = (column, index) => {
        //console.log('observando colunas state -> ', state.columns.length);

        if (state.columns.length < 10) {

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
        let tailwindCode = "p-2 text-left text-[14px] font-bold bg-stone-400/10 min-w-[200px] justify-between"

        if (index === 4 || index === 5 || index === 6 || index === 8 || index === 9) {

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

    return (
        <div className="bg-white w-full rounded-md overflow-x-auto shadow-md shadow-[#1b1b1b2a]">
            <span ref={refMessage} className="w-full min-h-[40px] p-1 justify-start items-center text-red-800 text-[12px] hidden">mensagem</span>
            <div>
                <div className="w-full flex gap-1">

                    {state.columns.map((column, index) => validateMainColumns(column, index))}

                </div>

                <div className="w-full flex flex-col">

                    {state.values.map((value, index) => (

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