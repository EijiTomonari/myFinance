import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Td,
  Input,
  Select,
  Checkbox,
  Button,
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import { Category, Transaction } from "../../../types/types";

const TransactionTableRowEditForm = ({
  transaction,
  categories,
}: {
  transaction: Transaction;
  categories: any;
}) => {
  return (
    <>
      <Td>
        <Input
          type="date"
          defaultValue={transaction.date.toString().slice(0, 10)}
        ></Input>
      </Td>
      <Td>
        <Input
          variant="outline"
          type="text"
          defaultValue={transaction.name}
        ></Input>
      </Td>
      <Td>
        <Input type="number" defaultValue={transaction.installment}></Input>
      </Td>
      <Td>
        <Input type="number" defaultValue={transaction.installments}></Input>
      </Td>
      <Td>
        <Select
          onChange={(e) => {
            const newTransaction: Transaction = {
              ...transaction,
              category: e.target.value,
            };
            //updateTransaction(newTransaction)
          }}
        >
          <option value={transaction.category}>{transaction.category}</option>
          {categories &&
            categories.map((category: Category) => {
              return (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              );
            })}
        </Select>
      </Td>
      <Td textAlign="center">
        <Checkbox
          alignSelf="center"
          defaultChecked={transaction.thirdparty}
          onChange={(e) => {
            const newTransaction: Transaction = {
              ...transaction,
              thirdparty: e.target.checked,
            };
            //updateTransaction(newTransaction)
          }}
        ></Checkbox>
      </Td>
      <Td>{"R$ " + transaction.value}</Td>

      <Td>
        <Flex>
          <Tooltip label="Save">
            <Button
              ml={2}
              onClick={(e) => {
                e.preventDefault();
                //deleteTransaction(transaction._id)
                //fetchTransactions(limit, skip)
              }}
              colorScheme="green"
            >
              <CheckCircleIcon />
            </Button>
          </Tooltip>
          <Tooltip label="Delete">
            <Button
              ml={2}
              onClick={(e) => {
                e.preventDefault();
                //deleteTransaction(transaction._id)
                //fetchTransactions(limit, skip)
              }}
              colorScheme="red"
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </Flex>
      </Td>
    </>
  );
};

export default TransactionTableRowEditForm;
