import { Transaction } from "../../../common/types/types";

// Transactions CRUD ------------------------------------------
const fetchTransactions = async (limit: number, skip: number) => {
  try {
    let response = await fetch(
      `/api/transactions?limit=${limit}&skip=${skip}`,
      { method: "GET" }
    );
    let data = await response.json();
    return data.message;
  } catch (error) {
    console.log(error);
  }
};

const updateTransaction = async (
  newTransaction: Transaction,
  transactions: Transaction[]
) => {
  const newTransactions: Transaction[] = [...transactions];

  const index = transactions.findIndex(
    (transaction: Transaction) => transaction._id == newTransaction._id
  );

  newTransactions[index] = newTransaction;

  // debugger;
  //setTransactions(newTransactions);

  //setEditing(true);
  try {
    let response = await fetch("/api/transactions", {
      method: "PUT",
      body: JSON.stringify({
        _id: newTransaction._id,
        category: newTransaction.category,
        thirdparty: newTransaction.thirdparty,
      }),
    });
    let data = await response.json();
    if (data.success) {
      //setEditing(false);
      //   return toast({
      //     title: "OK",
      //     description: "Transaction updated",
      //     status: "success",
      //     duration: 1000,
      //     isClosable: true,
      //   });
    } else {
      //   setEditing(false);
      //   return toast({
      //     title: "Something went wrong",
      //     description: data.message,
      //     status: "error",
      //     duration: 2000,
      //     isClosable: true,
      //   });
    }
  } catch (error) {
    // setEditing(false);
    // return toast({
    //   title: "Something went wrong",
    //   description: error as string,
    //   status: "error",
    //   duration: 2000,
    //   isClosable: true,
    // });
  }
};

const deleteTransaction = async (id: string | undefined) => {
  try {
    let response = await fetch("/api/transactions", {
      method: "DELETE",
      body: JSON.stringify({ _id: id }),
    });
    let data = await response.json();
    if (data.success) {
      //   return toast({
      //     title: "OK",
      //     description: "Transaction deleted",
      //     status: "success",
      //     duration: 1000,
      //     isClosable: true,
      //   });
    } else {
      //   return toast({
      //     title: "Something went wrong",
      //     description: data.message,
      //     status: "error",
      //     duration: 2000,
      //     isClosable: true,
      //   });
    }
  } catch (error) {
    // return toast({
    //   title: "Something went wrong",
    //   description: error as string,
    //   status: "error",
    //   duration: 2000,
    //   isClosable: true,
    // });
  }
};
export default fetchTransactions;
