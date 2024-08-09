/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import HomeAdvFooter from "./HomeAdvFooter";

// id: string
// nano_id: string | null
// categorie: string | null
// creator_id: string
// advertiser_id?: string | null
// Advertiser?: IAdvertiser | any
// client_id?: string | any
// subscribed_clients?: IClient[]
// Bid?: IBid[]
// title: string
// tags: string[]
// auct_cover_img: string
// product_list?: IProduct[]
// descriptions_informations: string
// terms_conditions: string
// auct_dates: AuctDateGroups[];
// limit_client: boolean
// limit_date: boolean
// accept_payment_methods: PaymentMethod[]
// value: string
// status: AuctStatus
// product_timer_seconds: number
// created_at: Date
// updated_at: Date


function HomeAdvShop() {
    const [currentAuct, setCurrentAuction] = useState({})
    const [productsFiltered, setProductsFiltered] = useState([])

    const navigate = useNavigate()
    const { auct_id } = useParams()
    const shopWindowShop = useRef()

    useEffect(() => {

        getAuctionById()
        getProductFiltered()

    }, [])

    const getAuctionById = async () => {
        try {

            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct`, {
                params: {
                    auct_id
                }
            }).then(response => {
                // console.log("leilão encontrado -> ", response.data.auct_dates)
                setCurrentAuction(response.data)
            })

        } catch (error) {
            console.log("error at get auction by id: ", error.message)
        }
    }

    const getProductFiltered = async () => {

        try {

            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
                params: {
                    auct_id: auct_id,
                    take: 16
                }
            }).then(response => {
                console.log("produtos encontrados -> ", response.data)
                setProductsFiltered(response.data)
                // setFilteredProducts(response.data)
            })

        } catch (error) {
            console.log("error at get product filtered: ", error.message)
        }

    }


    return (
        <div ref={shopWindowShop} className="flex flex-col  w-full h-[160vh] bg-[#0D1733] justify-start items-center">
            {/* Header */}

            <div className="flex w-full  min-h-[40vh] overflow-hidden bg-white relative">
                <img src={currentAuct.auct_cover_img} alt="" className="object-cover absolute w-full h-full" />
            </div>

            {/* Body Main */}
            <div className="flex flex-col w-[70%] h-auto bg-[#DEDEDE] mb-[3vh] mt-[3vh]">

                <div className="w-full h-[430px] bg-gradient-to-b from-[#c4c4c4] to-[#f4f4f4] shadow-inner shadow-[#1c1c1c22]">

                    <div className="w-full h-[130px] bg-white shadow-2xl shadow-[#0909093f] p-[4vh]">
                        <h1 className="text-[32px] w-fit font-bold border-b-[1px] border-[#202020] pb-[4px]">
                            {currentAuct.title}
                        </h1>

                        <div className="flex gap-2">
                            <span>{currentAuct.auct_dates && dayjs(currentAuct.auct_dates[0].date_auct).format('DD')}</span>
                            <span>-</span>
                            <span>{currentAuct.auct_dates && dayjs(currentAuct.auct_dates[currentAuct.auct_dates.length - 1].date_auct).format('DD')}</span>
                            <span>de</span>
                            <span>{currentAuct.auct_dates && dayjs(currentAuct.auct_dates[0].date_auct).format('MMMM')}</span>
                            <span className="font-bold">
                                {currentAuct.auct_dates && dayjs(currentAuct.auct_dates[currentAuct.auct_dates.length - 1].date_auct).format('YYYY')}
                            </span>
                        </div>
                    </div>



                    {/* Filtros */}
                    <div className="flex flex-col w-full h-[210px] p-[3vh] relative gap-3">
                        <input type="text" placeholder="pesquisar"
                            className="w-[70%] h-[47px] bg-white border-[1px] 
                        border-[#bebebe] rounded-[3px] p-2"/>

                        <div className="flex gap-3 w-[70%]">

                            <select name="" id="" className="w-[160px] h-[47px] bg-white border-[1px] 
                            border-[#bebebe] rounded-[4px] p-2 flex-1">
                                <option value="">todos os lotes</option>
                            </select>

                            <select name="" id="" className="w-[160px] h-[47px] bg-white border-[1px] 
                            border-[#bebebe] rounded-[4px] p-2">
                                <option value="">categorias</option>
                            </select>

                            <select name="" id="" className="w-[160px] h-[47px] bg-white border-[1px] 
                            border-[#bebebe] rounded-[4px] p-2">
                                <option value="">grupos</option>
                                {
                                    currentAuct.auct_dates &&
                                    currentAuct.auct_dates.map((date, i) => {
                                        return (
                                            <option key={i} value={date.id}>{date.group}</option>
                                        )
                                    })
                                }
                            </select>

                            <div className="flex justify-center items-center gap-3">
                                <span>ordenar: </span>

                                <select name="" id="" className="w-[160px] h-[47px] bg-white border-[1px] 
                                    border-[#bebebe] rounded-[4px] p-2">
                                    <option value="">Lances</option>
                                    <option value="">Lotes</option>
                                    <option value="">Valor</option>
                                </select>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Produtos */}

                <div className="flex flex-wrap w-full max-h-[70vh] bg-white gap-3 p-2 justify-center overflow-y-auto">
                    {
                        productsFiltered.map(product => {

                            return (
                                <div className="w-[200px] h-[278px] bg-[#c6c6c6] 
                                relative overflow-hidden cursor-pointer hover:border-[1px]"
                                    onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                                    key={product.id}>
                                    <img src={product.cover_img_url} alt="" className="h-[200px] w-full object-cover" />
                                </div>
                            )
                        })
                    }
                </div>

            </div>

            {/* Footer */}
            <HomeAdvFooter />
        </div>
    )
}

export default HomeAdvShop;