let profileFile = "none"
let companyFile = "none"

const setFiles = (profile, company) => {

    return new Promise((resolve, reject) => {

        try {

            if (profile) profileFile = profile
            if (company) companyFile = company
            resolve(true)

        } catch (error) {
            console.log("error at try get file -> ", error)
            reject(error)
        }

    })

}

const getFiles = () => {

    return new Promise((resolve, reject) => {

        try {

            const data = [profileFile, companyFile]
            resolve(data)

        } catch (error) {
            console.log("error at try get file -> ", error)
            reject(error)
        }

    })

}

export { setFiles, getFiles };