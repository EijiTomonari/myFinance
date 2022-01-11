export type Transaction = {
    _id?: string,
    date: Date,
    value: number,
    name: string,
    card: string,
    installment: number,
    installments: number,
    category: string
    thirdparty?: boolean,
}

export type TestType ={
    _id:string,
    category: string
}

export type Category = {
    _id: string,
    name: string,
}