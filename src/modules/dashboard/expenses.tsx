import { ChartData } from "chart.js"
import { Expenses } from "../../common/types/types"

export const fetchExpenses = async (initialdate:string) => {
    try {
        let response = await fetch(`/api/expenses?initialdate=${initialdate}`, {method: 'GET'})
        let data = await response.json()
        return(data.message)
    } catch (error) {
        console.log(error)
    }
}

export const getCategoriesChartData = (expenses?:Expenses) : ChartData<"doughnut",number[],unknown> =>{
    if (!expenses) {
        return(
            {
                labels: ["None"],
                datasets: [
                    {
                        data: [0],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1
                    },
                ]
            }
        )
    }
    const labels:string[] = []
    const values:number[] = []
    expenses.expensespercategory.forEach(expense => {
        labels.push(expense._id)
        values.push(expense.value)
    });
    return(
        {
            labels: labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1
                },
            ]
        }
    )
}

