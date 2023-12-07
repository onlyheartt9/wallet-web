import { Tabs, Form, Input, Button, Card, Result } from 'antd-mobile';
import React, { useEffect } from 'react';
import BackBtn from '../../component/BackBtn';
import { useState } from 'react';
import AddressForm from './components/AddressForm';
import SendForm from './components/SendForm';
import ReceiptForm from './components/ReceiptForm';
import './styles.scss';
import SendBtn from './components/SendBtn';
import { SendErrorCheck } from './utils/ErrorCheck';
import { Global } from '../../../server/Global';
import { message } from 'antd';
import { Config } from '../../../server/config/Config';

type Props = {};

export type TransactionDetail = {
  address?: string;
  amount?: string | number;
  token?: string;
  receiver?: string;
  source?: 'Mumbai' | 'Fuji';
  target?: 'Mumbai' | 'Fuji';
};

const initialTransactionDetail = {
  address: '', // 发送人地址
  amount: '', // 发送数量
  token: '', // 代币类型
  receiver: '', // 接收人地址
};

type InitalData = {
  balance?: string;
};

const initialAmountAndAddressData = {
  balance: '',
};

const tabItems = [
  { key: 'add', title: 'Address' },
  { key: 'rec', title: 'Receipt' },
];

const USDContact = '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97';

const Contacts: React.FC<Props> = () => {
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail>(initialTransactionDetail);
  const [tradingMode, setTradingMode] = useState(true); // 为了实现添加联系人时，控制send 按钮不渲染。
  const [activeKey, setActiveKey] = useState(tabItems[0].key);
  const [initialData, setInitialData] = useState<InitalData>(initialAmountAndAddressData);
  const [messageApi, contextHolder] = message.useMessage();
  
  const successMessageBox = (successMessage: string) => {
    messageApi.open({
      type:'success',
      content: successMessage
    })
  }

  const errorMessageBox = (errorMessage: string) => {
    messageApi.open({
      type:'error',
      content:errorMessage
    })
  }

  const handleTransactionDetail = (key: keyof TransactionDetail, value: any) => {
    setTransactionDetail((prev) => ({ ...prev, [key]: value })); // 把变量名为 key 的值设为 value
  };

  const handleInfoDetail = (key: keyof InitalData, value: any) => {
    setInitialData((prev) => ({ ...prev, [key]: value })); // 把变量名为 key 的值设为 value
  };

  // 获取Balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const contractAddress = localStorage.getItem('contractWalletAddress').toString();
        const _balance = await Global.account.getBalanceOfERC20(USDContact, contractAddress, 6);
        console.log(_balance)
        handleTransactionDetail('address',contractAddress);
        handleInfoDetail('balance', _balance);
      } catch (e) {
        console.error('fetchBalance error is: ', e);
      }
    };
    fetchBalance();
  }, []);

    const handleTransfer = async () => {
    // Global.account.contractWalletAddress 为发送人地址
    try {
      const { address, amount, receiver } = transactionDetail;
      const { balance } = initialData;
      console.log(address, amount, receiver);
      console.log(balance);
      // error check
      const errorMessage = SendErrorCheck(transactionDetail,balance);
      if (errorMessage !== null) {
        console.error(errorMessage);
        errorMessageBox(errorMessage);
      }
      const gas = await Global.account.getGasPrice();
      // console.log(gas)
      // console.log(USDContact,
      //   amount.toString(),
      //   receiver,
      //   Config.ADDRESS_TOKEN_PAYMASTER,
      //   Config.ADDRESS_ENTRYPOINT,
      //   gas,)
      const result = await Global.account.sendTxTransferERC20Token(
        USDContact,
        amount.toString(),
        receiver,
        Config.ADDRESS_TOKEN_PAYMASTER,
        Config.ADDRESS_ENTRYPOINT,
        gas,
      );
      console.log(result);
      if(result.status === 200) {
        successMessageBox('Send success');
      }
    } catch (e) {
      errorMessageBox(e as string)
      console.log(e);
    }
  };

  return (
    <div>
      <div className="">
        <BackBtn />
      </div>
      {contextHolder}
      <main className="flex flex-col pt-0" style={{ height: '80vh' }}>
        {/* Send Form*/}
        <div className="flex-auto p-8 ">
          <h1 className="text-5xl" style={{ color: '#0A3D53' }}>
            Send
          </h1>
          <SendForm {...transactionDetail} onChange={handleTransactionDetail} />
        </div>
        {/* To Form*/}
        <div className="h-3/5" style={{ minHeight: '800px' }}>
          <div className="flex-auto h-16 px-8 py-4" style={{}}>
            <h1 className="text-5xl" style={{ color: '#0A3D53' }}>
              To
            </h1>
          </div>
          <div className="flex-auto p-1">
            <Tabs
              activeKey={activeKey}
              onChange={(key) => {
                setActiveKey(key);
              }}
              className=""
              style={{ margin: 'none' }}
            >
              <Tabs.Tab
                title="Address"
                key="add"
                className="h-28 flex items-center text-2xl"
                style={activeKey === 'add' ? { fontWeight: 'bold', backgroundColor: 'rgba(217, 217, 217, 0.7)' } : {}}
              >
                <AddressForm {...transactionDetail} onChange={handleTransactionDetail} />
              </Tabs.Tab>
              <Tabs.Tab
                title="Receipt"
                key="rec"
                className="h-28 flex items-center"
                style={activeKey === 'add' ? {} : { fontWeight: 'bold', backgroundColor: 'rgba(217, 217, 217, 0.7)' }}
              >
                <ReceiptForm
                  {...transactionDetail}
                  onChange={handleTransactionDetail}
                  setTradingMode={setTradingMode}
                />
              </Tabs.Tab>
            </Tabs>
          </div>
        </div>
        {/* Send Btn*/}
        <div className="flex-auto h-1/5">{tradingMode ? <SendBtn handleTransfer={handleTransfer} /> : null}</div>
      </main>
    </div>
  );
};

export default Contacts;
