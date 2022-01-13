export const fetchCards = async () => {
    try {
        let response = await fetch(`/api/cards`, {method: 'GET'})
        let data = await response.json()
        return(data.message)
    } catch (error) {
        console.log(error)
    }
}
