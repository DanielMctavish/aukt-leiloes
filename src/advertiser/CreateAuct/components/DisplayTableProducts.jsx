/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDropDown } from "@mui/icons-material";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function DisplayTableProducts() {
    const state = useSelector(state => state.products.products)

    useEffect(() => {
        console.log("observando estado tabelas -> ", state);
    }, [state.products])

    return (
        <div className="bg-white w-full rounded-md overflow-x-auto">
            <table className="w-full bg-white rounded-md">
                <thead>
                    <tr className="border-b-[.4px] border-zinc-300 flex">
                        {state.columns.map((column, index) => (
                            <th key={index} className="px-6 py-3 text-left text-zinc-400 font-semibold flex">
                                <span>{column}</span>
                                <ArrowDropDown />
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    <tr className="border-b-[.4px] border-zinc-300 text-zinc-600 flex justify-start">

                        {state.values.map((value, index) => (
                            <td key={index} className="px-6 py-4 text-left text-[14px] font-bold">
                                {value}
                            </td>
                        ))}

                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default DisplayTableProducts