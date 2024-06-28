import logoAuk from "./media/logos/logos-auk/aukt_blue.png"

function DeveloperScreen() {

    return (
        <div className="flex flex-col w-full h-[100vh] 
        justify-center items-center gap-[20px]
        bg-gradient-to-r from-[#3b5c7c] to-[#fff]">

            <span className="font-bold">(em manutenção, de novo...)</span>
            <span style={{textShadow:"1px 2px 3px #1d1d1d90"}} className="text-[26px]">estamos melhorando tudo por aqui</span>
            <img src={logoAuk} alt="" className="w-[300px] object-cover" />

        </div>
    )

}

export default DeveloperScreen;