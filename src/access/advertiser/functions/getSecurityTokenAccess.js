import dayjs from "dayjs"

class SecurityTokenManager {
    constructor() {
        this.timeLeftInterval = null;
    }

    getSecurityTokenAccess(navigate, register_token, setTimeTokenLeft) {
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

        this.clearInterval();

        this.timeLeftInterval = setInterval(() => {
            const currentMoment = dayjs().valueOf()
            const timeLeft = expirationDate - currentMoment

            if (timeLeft <= 0) {
                this.clearInterval();
                localStorage.removeItem("token-access-register-advertiser")
                navigate("/security-confirmation")
                return
            }

            setTimeTokenLeft(dayjs(timeLeft).format("mm:ss"))
        }, updateInterval)
    }

    clearInterval() {
        if (this.timeLeftInterval) {
            clearInterval(this.timeLeftInterval);
            this.timeLeftInterval = null;
        }
    }
}


export const securityTokenManager = new SecurityTokenManager();