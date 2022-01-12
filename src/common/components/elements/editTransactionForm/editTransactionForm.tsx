// Imports --------------------------------------------
import {CalendarIcon} from "@chakra-ui/icons"
import {
    Button,
    Flex,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text
} from "@chakra-ui/react"
import {Transaction} from "../../../types/types"

const EditModal = ({isOpen, onClose, transaction} : {
    isOpen: boolean,
    onClose: () => void,
    transaction: Transaction
}) => {
    return (
        <Modal isOpen={isOpen}
            onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Edit transaction</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <form>
                        <InputGroup py={2}>
                            <InputLeftAddon pointerEvents='none'
                                children={
                                    <CalendarIcon
                                color='gray.300'/>
                                }/>
                            <Input required type='date' placeholder='Value'/>
                        </InputGroup>
                        <Input required type='text' placeholder='Name'
                            value={
                                transaction.name
                            }/>
                        <InputGroup py={2}>
                            <InputLeftAddon children='R$'/>
                            <Input required type='number' placeholder='Value'
                                value={
                                    transaction.value
                                }/>
                        </InputGroup>
                        <Select required placeholder='Select Category'
                            py={2}
                            value={
                                transaction.category
                        }>
                            {/* {
                    categoriesData.map((cat : Category) => (
                        <option value={
                            cat.name
                        }>
                            {
                            cat.name
                        }</option>
                    ))
                } */} </Select>
                        <Select required placeholder='Select Card'
                            py={2}
                            value={
                                transaction.card
                        }>
                            {/* {
                    cardsData.map((card : CreditCardData) => (
                        <option value={
                            card.lastfourdigits
                        }>
                            {
                            card.lastfourdigits + " - " + card.nickname
                        }</option>
                    ))
                }  */} </Select>
                        <Flex alignContent='space-between'

                            py={2}>

                            <Input type='number' placeholder='Installment'
                                mr={4}
                                value={
                                    transaction.installment
                                }/>
                            <Text alignSelf='center'>of</Text>
                            <Input type='number' placeholder='Installments'
                                value={
                                    transaction.installments
                                }
                                ml={4}/>
                        </Flex>
                        <Text pt={4}
                            color='red'>
                            Error</Text>
                        <Text pt={4}
                            color='green'>
                            Message</Text>
                            <ModalFooter>
                    <Button colorScheme='blue'
                        mr={3}
                        onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
                    </form>
                </ModalBody>

                
            </ModalContent>
        </Modal>
    )
}

export default EditModal
