/* eslint-disable react/prop-types */


function TimerComponent({ advertiser_percentage, clients_percentage, adms_percentage, totalUsers }) {
    const circumference = 2 * Math.PI * 80;

    const calculateProgress = (percentage) => {
        return (Math.min(Math.max(percentage, 0), 100) / 100) * circumference;
    };

    const userProgress = calculateProgress(advertiser_percentage);
    const clientsProgress = calculateProgress(clients_percentage);
    const admsProgress = calculateProgress(adms_percentage);

    return (
        <div className="w-full lg:w-[240px] h-[240px] flex flex-col justify-center items-center relative p-4 ml-2">
            <h2 className="w-[full] p-3 lg:text-[22px] text-[16px]">
                Total de usuários
            </h2>
            <div className="w-full lg:w-[180px] lg:min-h-[180px]  min-h-[180px]  flex justify-center items-center relative bg-[#434E6B] rounded-full text-white">

                {/* Clients Progress */}
                <svg className="absolute rotate-[-90deg]" width="180" height="180">
                    <circle
                        cx="90"
                        cy="90"
                        r="80"
                        fill="transparent"
                        stroke="#6400C8"
                        strokeWidth="22"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - clientsProgress}
                    />
                </svg>

                {/* Advertiser Progress */}
                <svg className="absolute" width="180" height="180">
                    <circle
                        cx="90"
                        cy="90"
                        r="80"
                        fill="transparent"
                        stroke="#191F2F"
                        strokeWidth="18"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - userProgress}
                    />
                </svg>

                {/* Admins Progress */}
                <svg className="absolute rotate-180" width="180" height="180">
                    <circle
                        cx="90"
                        cy="90"
                        r="80"
                        fill="transparent"
                        stroke="#D87400"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - admsProgress}
                    />
                </svg>

                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    className="absolute font-bold text-[33px]"
                >
                    {totalUsers}
                </text>
            </div>

        </div>
    );
}

export default TimerComponent;


