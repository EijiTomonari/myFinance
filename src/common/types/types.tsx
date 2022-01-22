export type Transaction = {
    _id?: string,
    uid?: string | null,
    date: Date,
    value: number,
    name: string,
    card: string,
    installment: number,
    installments: number,
    category: string,
    thirdparty?: boolean
}

export type Category = {
    _id: string,
    uid: string,
    name: string
}

export type CreditCard = {
    _id?: string,
    uid?: string | null,
    lastfourdigits: number,
    name: string,
    validthru: string,
    company: string,
    nickname: string
}

export type Expenses = {
    totalexpenses: [
        {
            _id: string,
            value: number
        }
    ],
    thirdpartyexpenses: [
        {
            _id: string,
            value: number
        }
    ],
    nextmonthinstallments: [
        {
            _id: string,
            value: number
        }
    ],
    expensespercategory:[
        {
            _id: string,
            value:number
        }
    ]
}
