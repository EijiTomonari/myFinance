import {
  CircularProgress,
  Flex,
  Heading,
  Link,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  AddIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  CheckCircleIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { Transaction } from "../../common/types/types";
import SideBar from "../../common/components/elements/sideBar/sideBar";
import { fetchCategories } from "../../modules/categories/categoriesDatabaseServices";
import fetchTransactions from "../../modules/transactions/database/transactionsDatabaseServices";
import TransactionTableRow from "../../common/components/elements/transactions/transactionTableRow";
import TransactionTableRowEditForm from "../../common/components/elements/transactions/transactionTableRowEditForm";

const Transactions: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/signin");
    },
  });

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const data = await fetchCategories();
      setCategories(data);
    }
    fetchData();
  }, []);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [limit, setLimit] = useState(30);
  const [skip, setSkip] = useState(0);

  const nextPage = () => {
    setSkip(skip + limit);
  };

  const previousPage = () => {
    setSkip(skip - limit);
  };

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const data = await fetchTransactions(limit, skip);
      setTransactions(data);
    }
    fetchData();
    setLoading(false);
  }, [skip, limit]);

  return (
    <Flex h="100vh" flexDir="row" overflow="hidden">
      <Head>
        <title>MyFinance</title>
      </Head>
      <SideBar session={session} />
      <Flex flexDir="column" overflowY="auto" w={"100%"} overflowX="hidden">
        <Heading mb={2} ml={4} mt={4} fontWeight="light" fontSize="3xl">
          Transactions
        </Heading>
        <Flex flexDir="row" justifyContent="space-between">
          <Flex dir="row">
            <Link href="/transactions/add">
              <Button
                leftIcon={<AddIcon />}
                backgroundColor="green.200"
                py={4}
                px={7}
                my={4}
                ml={4}
              >
                Add Transactions
              </Button>
            </Link>
            <Button
              leftIcon={isEditing ? <CheckCircleIcon /> : <EditIcon />}
              backgroundColor="yellow.200"
              py={4}
              px={7}
              my={4}
              ml={4}
              onClick={(e) => setIsEditing(!isEditing)}
            >
              {isEditing ? "Exit Edit Mode" : "Edit Mode"}
            </Button>
          </Flex>
          <Flex flexDir="row" alignSelf="center" mr={4}>
            <Button isDisabled={skip == 0} onClick={previousPage} mr={4}>
              <ArrowBackIcon />
            </Button>
            <Button isDisabled={transactions.length < limit} onClick={nextPage}>
              <ArrowForwardIcon />
            </Button>
          </Flex>
        </Flex>
        {loading && (
          <Flex width="full" align="center" justifyContent="center">
            <CircularProgress isIndeterminate color="green.300" />
          </Flex>
        )}
        {!loading && (
          <Table ml={4}>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Name</Th>
                <Th textAlign={"center"}>Installment</Th>
                <Th textAlign={"center"}>Total Installments</Th>
                <Th>Category</Th>
                <Th textAlign={"center"}>Third-party</Th>
                <Th>Value</Th>
                {isEditing && <Th>Actions</Th>}
              </Tr>
            </Thead>
            <Tbody fontSize="smaller">
              {transactions.map((transaction: Transaction) => {
                return (
                  <Tr key={transaction._id}>
                    {isEditing ? (
                      <TransactionTableRowEditForm
                        transaction={transaction}
                        categories={categories}
                      />
                    ) : (
                      <TransactionTableRow transaction={transaction} />
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}

        <Flex
          flexDir="row"
          alignSelf="flex-end"
          mr={4}
          my={2}
          justifyContent="end"
        >
          <Button isDisabled={skip == 0} onClick={previousPage} mr={4}>
            <ArrowBackIcon />
          </Button>
          <Button isDisabled={transactions.length < limit} onClick={nextPage}>
            <ArrowForwardIcon />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Transactions;
