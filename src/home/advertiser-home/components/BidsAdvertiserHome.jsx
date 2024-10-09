/* eslint-disable react/prop-types */
//avatares import
import avatar_01 from '../../../media/avatar-floor/avatar_01.png'
import avatar_02 from '../../../media/avatar-floor/avatar_02.png'
import avatar_03 from '../../../media/avatar-floor/avatar_03.png'
import avatar_04 from '../../../media/avatar-floor/avatar_04.png'
import avatar_05 from '../../../media/avatar-floor/avatar_05.png'
import avatar_06 from '../../../media/avatar-floor/avatar_06.png'
import avatar_07 from '../../../media/avatar-floor/avatar_07.png'
import avatar_08 from '../../../media/avatar-floor/avatar_08.png'

import { SmartToy, Person } from '@mui/icons-material';

function BidsAdvertiserHome({ bidInformations, showBids }) {

    const avatares_pessoas = [
        avatar_01,
        avatar_02,
        avatar_03,
        avatar_04,
        avatar_05,
        avatar_06,
        avatar_07,
        avatar_08
    ];

    return (
        <div className={`${!showBids ? 'mr-[-160vh] opacity-0' : 'mr-[1vh] opacity-100'} flex-col min-w-[370px] h-full justify-start items-center 
                    p-3 bg-[#D5DCDC] rounded-[12px] shadow-lg shadow-[#1616162f] overflow-y-auto transition-all duration-[1s]`}>
            {
                bidInformations.map((bid) => {
                    if (!bid.client) return null
                    return (
                        <div className='w-full bg-[#233751] rounded-[12px] h-[40px] text-white font-bold 
                                    flex justify-between items-center p-1 mt-[2px]'
                            key={bid.id}>
                            <div className="flex items-center">
                                <img src={avatares_pessoas[bid.client.client_avatar]} alt=""
                                    className='w-[33px] h-[33px] object-cover rounded-full mr-2' />
                                {bid.cover_auto ? 
                                    <SmartToy sx={{ fontSize: 20, color: '#4CAF50' }} /> : 
                                    <Person sx={{ fontSize: 20, color: '#2196F3' }} />
                                }
                            </div>
                            <span>{bid.client && bid.client.nickname}</span>
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                .format(bid.value)}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default BidsAdvertiserHome;