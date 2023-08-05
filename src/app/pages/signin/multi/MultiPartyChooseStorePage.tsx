import { NavLink } from 'react-router-dom';
import React from 'react';
import HeaderBar from '../../../elements/HeaderBar';
import SWCell from '../../../component/SWCell';

export default function MultiPartyChooseStorePage(props: {}) {
  return (
    <div className="px-[20px]">
      <HeaderBar text="Setup Login Keys" />

      <div className="text-2xl">1st login key:</div>
      <div className="mt-4">
        <SWCell text="Store in local device" to="/signin/multi/MultiParty-SignUp-Local" shadow={true} />
      </div>
      <div className="mt-4">
        <SWCell text="Store in IPFS" to="/signin/multi/MultiParty-SignUp-Local" shadow={true} />
      </div>
      <div className="mt-4">
        <SWCell text="Store in wallet server Wallet" to="/signin/multi/MultiParty-SignUp-Local" shadow={true} />
      </div>
      <div className="mt-4">
        <SWCell text="Store in other people" to="/signin/multi/MultiParty-SignUp-Local" shadow={true} />
      </div>
    </div>
  );
}
