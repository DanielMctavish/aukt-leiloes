import { GraphElement } from "./GraphElement"
import {ArrowDropDown} from "@mui/icons-material"

function PanelGraph() {

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-1">
            <div className="w-full  flex justify-end items-center gap-3 cursor-pointer">
                <span>out</span>
                <ArrowDropDown/>
            </div>

            <GraphElement />

        </div>
    )
}

export default PanelGraph