import React from 'react'
import styled from 'styled-components'

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
  render () {
    return (
      <Wrapper>
        <Label>Your public key:</Label>
        <Address>akdsfgak fasdf7dsf678asd5f5as</Address>
      </Wrapper>
    )
  }
}
