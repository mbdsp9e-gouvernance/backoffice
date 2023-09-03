import PropTypes from 'prop-types'
import React from 'react'
import { CCallout } from '@coreui/react'


class DocsCallout extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    href: PropTypes.string,
    name: PropTypes.string,
  }
  render(){
  const { content, name } = this.props

  const plural = name.slice(-1) === 's' ? true : false

  // const _href = `https://coreui.io/react/docs/${packageJson.config.coreui_library_short_version}/${href}`

  return (
    <CCallout color="info" className="bg-white">
      {content
        ? content
        : `A React ${name} component ${
            plural ? 'have' : 'has'
          } been created as a native React.js version
      of Bootstrap ${name}. ${name} ${plural ? 'are' : 'is'} delivered with some new features,
      variants, and unique design that matches CoreUI Design System requirements.`}
      <br />
      <br />
      For more information please visit our official{' '}
      {/* <CLink href={_href} target="_blank">
        documentation of CoreUI Components Library for React.js
      </CLink> */}
      .
    </CCallout>
  )}
}



export default React.memo(DocsCallout)
