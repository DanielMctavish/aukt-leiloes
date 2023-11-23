
function AuctsTableInfo() {

    return (
       
            <tbody>
                <tr className="border-b-[.4px] border-zinc-300">
                    {/* Número */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">1</td>
                    {/* ID - Leilão */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">#S88FS7S</td>
                    {/* Anunciante */}
                    <td className="px-6 py-4 text-left flex justify-start items-center gap-2">
                        <img src={''} alt="" className="w-[32px] h-[32px] object-cover rounded-full" />
                        <span className="text-zinc-400 font-bold text-[14px]">AUKT</span>
                    </td>
                    {/* Arremate */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">12 / 12 / 23</td>
                    {/* Título */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">2º Leilão de antiguidades</td>
                    {/* Ficha */}
                    <td className="px-6 py-4 text-left">
                        <span className="bg-[#ffca58] font-bold rounded-full p-2 text-[12px] cursor-pointer">Ficha</span>
                    </td>
                    {/* Venda */}
                    <td className="px-6 py-4 text-left text-[14px] font-bold">R$ 43.298,99</td>
                </tr>
                
            </tbody>
            
    )
}

export default AuctsTableInfo;