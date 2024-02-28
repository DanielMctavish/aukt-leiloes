import { GraphElement } from "./GraphElement"


function PanelGraph() {

    return (
        <div className="w-full h-full flex flex-col justify-center items-center relative">
            <div className="w-full  flex justify-end items-center gap-3 cursor-pointer relative text-zinc-600">
                <select name="" id="" className="p-1 w-[120px] bg-transparent">
                    <option value="">jan</option>
                    <option value="">fev</option>
                    <option value="">mar</option>
                    <option value="">abr</option>
                    <option value="">maio</option>
                    <option value="">jun</option>
                    <option value="">jul</option>
                    <option value="">ago</option>
                    <option value="">set</option>
                    <option value="">out</option>
                    <option value="">nov</option>
                    <option value="">dez</option>
                </select>
            </div>

            <GraphElement />

        </div>
    )
}

export default PanelGraph