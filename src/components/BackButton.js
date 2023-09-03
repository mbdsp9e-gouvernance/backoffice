import { cilChevronCircleLeftAlt } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from 'react-router'

class BackButton extends Component {
  
  onBack(to) {
    this.props.history.push(to);
  }

  render() {
    return (
      <CButton
        onClick={() => this.onBack(this.props.to)}
        color="light"
        style={{ width: "100px", marginBottom: "20px" }}
      >
        <CIcon icon={cilChevronCircleLeftAlt}></CIcon> Retour
      </CButton>
    );
  }
}

export default withRouter(BackButton);
