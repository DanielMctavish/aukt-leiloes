/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx"
import { useDispatch, useSelector } from "react-redux";
import { addProducts } from "../../../features/product/Products";
import { addAuct } from "../../../features/auct/Auct";
import { addGroupDate } from "../../../features/GroupDates/GroupDate";
import { CloudUpload } from "@mui/icons-material";

function DisplayProductsCsv() {
    const stateTheme = useSelector(state => state.theme)
    const [productsCount, setProductsCount] = useState(0)
    const [columns, setColumns] = useState([])
    const [values, setValues] = useState([])

    const dispatch = useDispatch()
    const refFile = useRef()
    const refMain = useRef()

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



    const formatProductData = (rawValues) => {
        return rawValues.map((row) => ({
            title: row[0] || '',
            description: row[1] || '',
            categorie: row[2] || '',
            initial_value: parseFloat(row[3]) || 0,
            reserve_value: parseFloat(row[4]) || 0,
            group: row[5] || '',
            owner_id: row[6] || '',
            width: 0,
            height: 0,
            weight: 0,
            cover_img_url: "string",
            highlight_product: true,
            group_imgs_url: [],
        }));
    };

    useEffect(() => {
        if (values.length > 0) {
            const formattedProducts = formatProductData(values);
            dispatch(addProducts({ columns, values }));
            dispatch(addAuct({ product_list: formattedProducts }));
            setProductsCount(values.length);
            identifyAndSetGroupDates();
        }
    }, [values]);

    const handleImportProducts = () => {
        refFile.current.click();
    }

    useEffect(() => {
        const fileInput = refFile.current;
        
        const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                importExcelOperation(file);
            }
        };

        fileInput.addEventListener('change', handleFileChange);
        return () => fileInput.removeEventListener('change', handleFileChange);
    }, []);

    const importExcelOperation = (currentFile) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = excelData[0];
            const filteredValues = excelData.filter((row, index) => 
                index !== 0 && row.some(cell => cell !== "")
            );

            setColumns(headers);
            setValues(filteredValues);
        };

        reader.readAsArrayBuffer(currentFile);
    }

    const identifyAndSetGroupDates = () => {
        let groupDates = [];
        let uniqueValues = new Set();

        values.forEach(line => {
            if (line[5] && !uniqueValues.has(line[5])) {
                uniqueValues.add(line[5]);
                groupDates.push(line[5]);
            }
        });

        if (groupDates.length > 0) {
            dispatch(addGroupDate({ groupDates }));
        }
    };

    return (
        <div ref={refMain} className="w-[33%] h-[100%] bg-white rounded-lg p-4
            hover:z-[77] hover:scale-[1.02] transition-all duration-300 ease-in-out
            shadow-xl shadow-[#00000020] flex flex-col justify-center items-center gap-6">

            <section className="flex gap-4 justify-center items-center">
                <span className="text-6xl font-bold text-[#012038]">{productsCount}</span>
                <div className="flex flex-col">
                    <span className="text-lg font-medium">TOTAL</span>
                    <button className="text-[#012038] hover:underline">
                        adicionar produto
                    </button>
                </div>
            </section>

            <input type="file" ref={refFile} className="hidden" accept=".csv,.xlsx,.xls" />
            <button 
                onClick={handleImportProducts} 
                className="flex items-center gap-2 px-6 py-3 bg-[#012038] text-white 
                rounded-lg hover:bg-[#012038]/90 transition-colors shadow-md">
                <CloudUpload />
                Importar CSV
            </button>
        </div>
    )
}

export default DisplayProductsCsv;