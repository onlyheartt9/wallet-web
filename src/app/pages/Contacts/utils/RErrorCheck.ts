import { contactType } from '../components/ReceiptForm';
import { BlockChains } from './blockchainConfig';

export const ErrorCheck = ({ name, receiver: newReciver, target: BlockChainValue }: contactType) => {
  if (name === '' || name === null || name === undefined) {
    return "name can't not be empty";
  }
  if (newReciver === '' || newReciver === null || newReciver === undefined) {
    return "newReciver can't not be empty";
  }
  if (newReciver.lastIndexOf('0x') != 0) {
    return 'This is no a ETH WALLET address syntax';
  }
  if (newReciver.length < 42) {
    return 'The length of address is not a ETH WALLET address';
  }
  if (BlockChainValue.length === 0 || BlockChainValue == null || BlockChainValue == undefined) {
    return "The blockchain value can't be empty";
  }
  if (!Object.keys(BlockChains).includes(BlockChainValue)) {
    return 'Your chosen chain is unsupported.';
  }
  return null;
};
