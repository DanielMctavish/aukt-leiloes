import dayjs from "dayjs"

const getSecurityTokenAccess = (navigate, register_token, setTimeTokenLeft) => {
    const securityToken = JSON.parse(localStorage.getItem("token-access-register-advertiser"))

    if (!securityToken) {
        navigate("/security-confirmation")
        return
    }

    if (securityToken.token !== register_token) {
        localStorage.removeItem("token-access-register-advertiser")
        navigate("/security-confirmation")
        return
    }

    const expirationDate = dayjs(securityToken.expiration).valueOf()
    const updateInterval = 1000

    const timeLeftInterval = setInterval(() => {
        const currentMoment = dayjs().valueOf()
        const timeLeft = expirationDate - currentMoment

        if (timeLeft <= 0) {
            clearInterval(timeLeftInterval)
            localStorage.removeItem("token-access-register-advertiser")
            navigate("/security-confirmation")
            return
        }

        setTimeTokenLeft(dayjs(timeLeft).format("mm:ss"))
    }, updateInterval)
}

export { getSecurityTokenAccess }