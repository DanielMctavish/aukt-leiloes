import { KeyboardArrowDown, Settings, DragHandle } from "@mui/icons-material"
import { useState } from "react"
import ModalSectionsConfigControls from "./components/ModalSectionsConfigControls"

function SectionsControlsTemplate() {
    const [isRetracted, setIsRetracted] = useState(true)
    const [isModalSectionsOpen, setIsModalSectionsOpen] = useState(false)


    if (isModalSectionsOpen) return (
        <ModalSectionsConfigControls
            setIsModalSectionsOpen={setIsModalSectionsOpen}
            setIsRetracted={setIsRetracted}
        />
    )


    return (
        <div className={`w-full flex flex-col bg-white/80 backdrop-blur-sm shadow-lg p-4 
            transition-all duration-300 relative rounded-lg ${isRetracted ? 'h-[6vh]' : 'h-full'}`}>

            <div className={`flex items-center ${isRetracted ? 'gap-12' : 'gap-2 w-full justify-between'}`}>
                <div className="flex items-center gap-2">
                    <DragHandle
                        className="text-gray-500"
                        sx={{ fontSize: '1.5rem' }}
                    />
                    <span className="font-medium text-gray-700 tracking-wide text-sm">SESSÕES</span>
                </div>
            </div>

            <div
                className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 
                    transition-all duration-200 absolute right-3 top-2.5"
                onClick={() => setIsRetracted(!isRetracted)}>
                <KeyboardArrowDown
                    className={`cursor-pointer transition-transform duration-300 text-gray-600 hover:text-blue-600 ${isRetracted ? 'rotate-180' : ''}`}
                    sx={{ fontSize: '1.5rem' }}
                />
            </div>

            {!isRetracted && (
                <div className="mt-6 space-y-6">
                    <div
                        onClick={() => setIsModalSectionsOpen(true)}
                        className="w-full h-[160px] flex flex-col gap-3 rounded-xl text-white 
                            hover:bg-[#144366] justify-center items-center bg-[#012038] 
                            border-[#fff] border-2 border-dashed cursor-pointer relative
                            transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Settings sx={{ fontSize: '47px' }} />
                        <span className="text-sm font-medium tracking-wide opacity-80">
                            CONFIGURAÇÕES
                        </span>
                    </div>


                </div>
            )}
        </div>
    )
}

export default SectionsControlsTemplate;