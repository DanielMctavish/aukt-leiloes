import LastAucts from "../../data/LastAucts";
import axios from "axios"

function TbodyAdvertisersLastAucts() {

    const getListCurrentAdvertiserAucts = async () => {

        const currentAdvertiserStorage = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        const configAuth = {
            headers: {
                "Authorization": `Bearer ${currentAdvertiserStorage.token}`
            }
        }

        
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentAdvertiserStorage.email}`, configAuth)
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${currentAdvertiserStorage.id}`, configAuth)

        } catch (error) {
            console.log(error)
        }
    }

    return (

        <tbody className=" overflow-y-auto">
            {LastAucts.map((auction, index) => (
                <tr className="border-b-[.4px] border-zinc-300 text-zinc-600" key={index}>
                    {/* Número */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">{auction.numero}</td>
                    {/* ID - Leilão */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">{auction.idLeilão}</td>
                    {/* Anunciante */}
                    <td className="px-6 py-4 text-left flex justify-start items-center gap-2">
                        <img src={auction.imagem} alt="" className="w-[32px] h-[32px] object-cover shadow-sm shadow-zinc-600 rounded-full" />
                        <span className="text-zinc-400 font-bold text-[14px]">{auction.nome}</span>
                    </td>
                    {/* Arremate */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">{auction.arremate}</td>
                    {/* Título */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">{auction.titulo}</td>
                    {/* Ficha */}
                    <td className="px-6 py-4 text-left">
                        <span className="bg-[#6400C836] text-[#B66CFF] font-bold rounded-full p-2 text-[12px] cursor-pointer">{auction.ficha}</span>
                    </td>
                    {/* Venda */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">{auction.valor}</td>
                </tr>
            ))}
        </tbody>

    )
}

export default TbodyAdvertisersLastAucts;