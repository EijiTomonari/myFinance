export const fetchExpenses = async (initialdate:string) => {
    try {
        let response = await fetch(`/api/expenses?initialdate=${initialdate}`, {method: 'GET'})
        let data = await response.json()
        return(data.message)
    } catch (error) {
        console.log(error)
    }
}
