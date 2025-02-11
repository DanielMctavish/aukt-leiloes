/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Close } from "@mui/icons-material";


function TestimonialsSectionControls({setCurrentSections, setIsModalTestimonials}){


    const handleCloseModal = ()=>{
        setIsModalTestimonials(false)
    }

    
    return(
        <div className="w-full h-[100vh] fixed top-0 left-0 bg-[#000000c3] 
        flex justify-center items-center z-[999] backdrop-blur-[3px] overflow-y-auto">

            <div className="w-[80%] h-[80%] bg-white rounded-lg shadow-lg flex flex-col 
            justify-between items-center relative p-6 overflow-y-auto">
                <span onClick={handleCloseModal} className="fixed text-white top-3 right-3 cursor-pointer">
                    <Close className="cursor-pointer" />
                </span>

            </div>

        </div>
    )

}

export default TestimonialsSectionControls;