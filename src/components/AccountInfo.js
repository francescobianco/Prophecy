import React from 'react'
import styled from 'styled-components'
import { Icon } from 'react-onsenui'

const Label = styled.div`
    font-size:.85em;
`

export const Address = styled.div`
    font-size:.65em;
    margin-bottom:20px;
    margin-top:1px;
    letter-spacing: .07em;
`

const Wrapper = styled.div`
    margin:20px 0px;
    width:100%;
    text-align: center;
`

export class AccountInfo extends React.Component {
  // TODO
  // copy on clipboard https://github.com/niconaso/cordova-plugin-clipboard-x
  render () {
    const {publicKey} = this.props

    return (
      <Wrapper onClick={() => this.props.onClick()}>
        <Label>Your public key:</Label>
        <Address>
          {publicKey} {'  '}
          <Icon icon='ion-ios-copy' size={20} />
        </Address>
      </Wrapper>
    )
  }
}
