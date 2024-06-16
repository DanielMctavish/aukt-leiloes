import { useNavigate } from "react-router-dom";


const ClientNavigation = () => {


    const navigate = useNavigate()

    return (
        <>
            <button onClick={() => navigate("/client/login")} className="mt-[6vh]">login</button>
            <button onClick={() => navigate("/client/arremates")}>arremates</button>
            <button onClick={() => navigate("/")}>AUK</button>
        </>
    )

}

export default ClientNavigation;