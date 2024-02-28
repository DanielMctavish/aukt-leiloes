/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx"
import { useDispatch } from "react-redux";
import { addProducts } from "../../../features/product/Products";
import { addAuct } from "../../../features/auct/Auct";


function DisplayProductsCsv() {
    const [productsCount, setProductsCount] = useState(0)
    const [columns, setColumns] = useState([])
    const [values, setValues] = useState([])

    const refFile = useRef()
    const dispatch = useDispatch()


    useEffect(() => {
        // Utilize useEffect para garantir que o estado seja atualizado antes do dispatch
        dispatch(addProducts({ columns, values }));

        const product_list = []
        //create and push into array product_list objects, where the keys are columns and values are "values"
        for (let i = 0; i < values.length; i++) {
            const product = {}
            for (let j = 0; j < values[i].length; j++) {
                product[columns[j]] = values[i][j]
            }
            product_list.push(product)
        }
        //console.log(product_list);
        dispatch(addAuct({ product_list: product_list }));

        setProductsCount(values.length)
    }, [values]);


    const handleImportProducts = async () => {
        refFile.current.click()


        refFile.current.addEventListener('change', () => {
            const currentFile = refFile.current.files
            console.log('arquivo carregado com sucesso... ', currentFile[0]);
            importExcelOperation(currentFile[0])
        });


    }

    const importExcelOperation = (currentFile) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Aqui você pode acessar os dados do arquivo Excel
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            setColumns(excelData[0])

            // Filtra as linhas em branco antes de definir os valores
            const filteredValues = excelData.filter((row, index) => index !== 0 && row.some(cell => cell !== ""));
            setValues(filteredValues);
        };

        reader.readAsArrayBuffer(currentFile);
    }

    return (
        <div className="w-[33%] h-[100%]
        hover:z-[77] hover:scale-[1.02] transition-[1s]
        flex flex-col justify-center items-center 
        bg-white rounded-md relative
        shadow-2xl shadow-[#00000039] p-3">
            <h2 className="font-bold absolute top-3 left-3">Produtos</h2>

            <section className="flex gap-3 justify-center items-center">
                <span className="font-bold text-[63px]">{productsCount}</span>
                <div className="flex flex-col">
                    <span>TOTAL</span>
                    <button>adicionar produto</button>
                </div>
            </section>
            <input type="file" ref={refFile} className="hidden" />
            <button onClick={handleImportProducts} className="p-1 w-[150px] h-[40px] bg-[#e8e8e8] rounded-md">importar CSV</button>
        </div>
    )
}

export default DisplayProductsCsv