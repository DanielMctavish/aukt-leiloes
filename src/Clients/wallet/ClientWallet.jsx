import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";


function ClientWallet(){

    return(
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideClient />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 text-zinc-600">

                <NavClient />

                <h2>Client Wallet</h2>

            </section>

        </div>

    </div>
    )
}

export default ClientWallet;