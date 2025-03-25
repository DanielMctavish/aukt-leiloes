import { useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { Send, Info } from "@mui/icons-material"

function FloorMessageSet() {
    const [currentMessage, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState({ type: '', message: '' })
    const generalAUK = useSelector(state => state.generalAUK)

    const handleSendMessage = async () => {
        if (!generalAUK.auct) {
            setFeedback({
                type: 'error',
                message: 'Selecione um leilão primeiro!'
            })
            return
        }

        if (!currentMessage.trim()) {
            setFeedback({
                type: 'error',
                message: 'Digite uma mensagem para enviar!'
            })
            return
        }

        setLoading(true)
        try {
            const currentSession = localStorage.getItem("advertiser-session-aukt")
            if (!currentSession) {
                setFeedback({
                    type: 'error',
                    message: 'Sessão expirada, faça login novamente!'
                })
                return
            }

            const sessionData = JSON.parse(currentSession)
            
            await axios.patch(
                `${import.meta.env.VITE_APP_BACKEND_API}/auct/update-auct?auct_id=${generalAUK.auct.id}`,
                { display_message: currentMessage },
                { headers: { 'Authorization': `Bearer ${sessionData.token}` } }
            ).then(response=>{
                console.log("response send auction message -> ", response)
            })

            setFeedback({
                type: 'success',
                message: 'Mensagem enviada com sucesso!'
            })
            
            // Limpar o campo após sucesso
            setMessage('')
            
            // Limpar o feedback após 3 segundos
            setTimeout(() => {
                setFeedback({ type: '', message: '' })
            }, 3000)
            
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error)
            setFeedback({
                type: 'error',
                message: 'Erro ao enviar mensagem. Tente novamente!'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex lg:w-[50%] w-full h-full p-3 bg-white rounded-md">
            <div className="flex flex-col w-full h-full bg-white rounded-md 
            overflow-hidden shadow-lg shadow-[#12121244] justify-start items-center relative">
                <div className="flex justify-between items-center w-full h-[46px] bg-[#012038] text-white p-2 px-4">
                    <span className="font-bold text-[14px]">Mensagem Pregão</span>
                    {!generalAUK.auct && (
                        <div className="flex items-center gap-1 text-yellow-300 text-sm">
                            <Info fontSize="small" />
                            <span>Selecione um leilão primeiro</span>
                        </div>
                    )}
                </div>

                <div className="w-full h-full p-4 flex flex-col">
                    <div className="flex flex-col gap-2 flex-grow">
                        <label className="text-sm text-gray-600 font-medium">
                            {generalAUK.auct 
                                ? `Mensagem para: ${generalAUK.auct.title}` 
                                : "Nenhum leilão selecionado"}
                        </label>
                        
                        <textarea 
                            onChange={(e) => setMessage(e.target.value)} 
                            value={currentMessage}
                            placeholder="Digite aqui sua mensagem para o pregão..."
                            className="w-full flex-grow min-h-[150px] bg-gray-50 border border-gray-200 
                                    rounded-lg p-3 focus:outline-none focus:ring-2 
                                    focus:ring-[#012038] focus:border-transparent
                                    resize-none transition-all duration-200"
                            disabled={!generalAUK.auct || loading}
                        />
                    </div>
                    
                    {feedback.message && (
                        <div className={`my-2 p-2 rounded-md text-sm ${
                            feedback.type === 'error' 
                                ? 'bg-red-100 text-red-800 border border-red-200' 
                                : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                            {feedback.message}
                        </div>
                    )}
                    
                    <div className="flex justify-end mt-3">
                        <button 
                            onClick={handleSendMessage}
                            disabled={!generalAUK.auct || loading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md
                                transition-all duration-200 ${
                                    !generalAUK.auct || loading
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-[#012038] text-white hover:bg-[#023161] shadow-md'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <Send fontSize="small" />
                                    <span>Enviar Mensagem</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FloorMessageSet