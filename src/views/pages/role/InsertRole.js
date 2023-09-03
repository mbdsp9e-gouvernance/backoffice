import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil } from "@coreui/icons";
import api from "../../../const/api";
import Loading from "../Loading";

export default class InsertRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entitled: "",
      message: "",
      load: false,
    };
  }

  addRole() {
    this.setLoad(true);
    fetch(api("role/create"), {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        entitled: this.state.entitled,
      }),
    }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          //console.log(data);
          this.setMessage("Ajout réussi");
          this.setLoad(false);
          this.props.history.push("/Home");
        });
      else {
        res.json().then((res) => {
          if (typeof res.message === typeof []) {
            console.log(res.message[0]);
            this.setMessage(res.message[0]);
            this.setLoad(false);
          } else {
            console.log(res.message);
            this.setMessage(res.message);
            this.setLoad(false);
          }
        });
      }
    });
  }
  render() {
    const { entitled, message, load } = this.state;
    return (
      <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
        <CContainer>
          {" "}
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <h1>Ajout Role</h1>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilPencil} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Intitule"
                        autoComplete="Intitule"
                        value={entitled}
                        onChange={this.setEntitled}
                      />
                    </CInputGroup>
                    <div className="d-grid">
                      {load ? (
                        <CButton id="aim-color-green" className="px-4" disabled>
                          <Loading></Loading>
                        </CButton>
                      ) : (
                        <CButton color="success" type="submit" onClick={() => this.addRole()}>
                          Ajouter
                        </CButton>
                      )}
                      <label>{message}</label>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
  setLoad(l) {
    this.setState({
      load: l,
    });
  }
  setEntitled = (e) => {
    this.setState({
      entitled: e.target.value,
    });
  };
  setMessage = (m) => {
    this.setState({
      message: m,
    });
  };
}
