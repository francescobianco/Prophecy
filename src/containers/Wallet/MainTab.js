import React from 'react'
import { Page } from 'react-onsenui'
import TransactionList from '../../components/TransactionList'
import {doClaimAllGas} from 'neon-js'
import { Balance } from '../../components/Balance'
// import BalanceChart from '../../components/BalanceChart'
// import { Separator } from '../../components/Separator'
import { AccountInfo } from '../../components/AccountInfo'
import {
  showToast
} from '../App/actions.js'

import {
  fetchTransaction,
  fetchBalance,
  fetchClaimAmount,
  setClaimRequest,
  doGasClaim,
  disableClaim,
  fetchMarketPrice
} from './actions'
import { connect } from 'react-redux'

// const data = [
//   {name: 'june', uv: 4000, pv: 2400, amt: 2400},
//   {name: 'july', uv: 3000, pv: 1398, amt: 2210},
//   {name: 'aug', uv: 2000, pv: 9800, amt: 2290}
// ]

class MainTab extends React.Component {
  // componentDidMount() {
  // const assetType = 'Gas';
  // const amount = 0.01;
  // doSendAsset('TestNet', toAddress, fromWif, assetType, amount)
  // .then((response) => {
  //   console.log("RS", response);
  //   if (response.result === undefined){
  //     console.log("Transaction failed!");
  //   } else {
  //     console.log("Transaction complete! Your balance will automatically update when the blockchain has processed it.")
  //   }
  // }).catch((e) => {
  //   console.log("Transaction failed!");
  // });
  // }

  constructor (props) {
    super(props)
    this.state = {
      state: 'initial'
    }

    this.refresh = this.refresh.bind(this)
    this.copyAddress = this.copyAddress.bind(this)
  }

  componentDidMount () {
    this.refresh()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.net !== this.props.net) {
      this.refresh(nextProps.net)
    }
  }

  componentDidUpdate () {
    // if we requested a claim and new claims are available, do claim
    if (this.props.claim.inProgress === true && this.props.claim.claimWasUpdated === true) {
      // WE NEED TO HIT REFERESH TO TRIGGER THAT
      console.info('Now we can do the actual claiming')
      this.props.dispatch(setClaimRequest(false))

      doClaimAllGas(this.props.net, this.props.account.wif).then((response) => {
        console.info('doClaimAllGas')
        if (response.result === true) {
          this.props.dispatch(showToast('Claim was successful!'))

          setTimeout(() => this.props.dispatch(disableClaim(false)), 300000)
          setTimeout(() => this.refresh(), 5000)
        } else {
          console.info('Claim failed')
          this.props.dispatch(showToast('Claim failed'))
        }
        setTimeout(() => this.refresh(), 5000)
      })
    }
  }

  copyAddress () {
    console.log('Copy')
    try {
      window.cordova.plugins.clipboard.copy(this.props.public_key, () => {
        this.props.dispatch(showToast('Public Key Copied!'))
      }, () => {
        this.props.dispatch(showToast('Error while copying'))
      })
    } catch (e) {
      throw new Error(e)
    }
  }

  refresh (net = this.props.net) {
    this.props.dispatch(fetchMarketPrice())
    this.props.dispatch(fetchTransaction(this.props.public_key, net))
    this.props.dispatch(fetchBalance(this.props.public_key, net))
    this.props.dispatch(fetchClaimAmount(this.props.public_key, net))
  }

  render () {
    const transactions = this.props.wallet.transactions.slice(0, 5)
    const doClaim = () => {
      this.props.dispatch(doGasClaim(this.props.net, this.props.account.wif, this.props.account.account.address, this.props.balance.NEO))
      setTimeout(() => this.refresh(), 5000)
    }

    return (
      <Page key='MainTab'>
        <AccountInfo
          publicKey={this.props.public_key}
          onClick={this.copyAddress}
           />

        <div style={{backgroundColor: '#F0ECEB', paddingTop: '10px', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
          <Balance
            NEO={this.props.balance.NEO}
            GAS={this.props.balance.GAS}
            NEO_PRICE={this.props.marketPrice.neo}
            GAS_PRICE={this.props.marketPrice.gas}
            availaleToClaim={this.props.wallet.availableToClaim}
            claimDisabled={this.props.claim.disabled}
            claimInProgress={this.props.claim.inProgress}
            onClaim={doClaim}
            onRefresh={this.refresh} />

        </div>

        { /* <BalanceChart data={data} /> */ }

        <TransactionList history={transactions} />

      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  wallet: state.wallet,
  public_key: state.account.account.address,
  claim: state.wallet.claimMetadata,
  marketPrice: state.wallet.price,
  net: state.app.net,
  balance: {
    NEO: state.wallet.Neo,
    GAS: state.wallet.Gas
  }
})

export default connect(mapStateToProps)(MainTab)
