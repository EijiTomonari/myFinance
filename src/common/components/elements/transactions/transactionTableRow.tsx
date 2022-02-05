import { Flex, Td, Text } from "@chakra-ui/react";
import { Transaction } from "../../../types/types";
import * as Icon from "react-feather";

const TransactionTableRow = ({ transaction }: { transaction: Transaction }) => {
  return (
    <>
      <Td>
        <Text>{new Date(transaction.date).toLocaleDateString("pt-BR")}</Text>
      </Td>
      <Td>{transaction.name}</Td>
      <Td textAlign={"center"}>{transaction.installment}</Td>
      <Td textAlign={"center"}>{transaction.installments}</Td>
      <Td>{transaction.category}</Td>
      <Td>
        {transaction.thirdparty ? (
          <Flex justifyContent="center">
            <Icon.CheckSquare></Icon.CheckSquare>
          </Flex>
        ) : (
          <Flex justifyContent="center">
            <Icon.Square></Icon.Square>
          </Flex>
        )}
      </Td>
      <Td>{"R$ " + transaction.value}</Td>
    </>
  );
};

export default TransactionTableRow;
