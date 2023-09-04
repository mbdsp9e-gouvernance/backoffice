import {
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CListGroup,
  CListGroupItem,
  CButton,
} from "@coreui/react";
import React, { Component } from "react";
// import api from "../../const/api";
import BackButton from "../../../components/BackButton";
import Loading from "../Loading";
import api from "../../../const/api";
// import Moment from "moment";

export default class RegistrationValidation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      details: null,
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  validateUser = () => {
    fetch(api(`users/validate/${this.props.match.params.id}`), {
      method: "PUT",
    }).then((res) => {
      if (res.ok) {
        this.props.history.push("/registration");
      }
    });
  }

  getUserData = () => {
    this.setLoading(true);
    fetch(api(`users/${this.props.match.params.id}`), { method: "GET" }).then(
      (res) => {
        if (res.ok) {
          return res.json().then((data) => {
            this.setState({
              details: data,
            });
            this.setLoading(false);
          });
        }
      }
    );
  };

  setLoading = (e) => {
    this.setState({ loading: e });
  };

  render() {
    const { loading, details } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <BackButton to={"/registration"} />
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader color="green">
              <strong>Détails et validation d'inscription</strong>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Nom: </strong>
                    {`${details.NOM}`}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Prénom: </strong>
                    {details.PRENOM}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Email: </strong>
                    {details.EMAIL}
                  </span>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
          <div className="mb-5 d-grid gap-2 d-md-flex justify-content-end">
            <CButton
              className="btn btn-danger"
              onClick={() => {
                this.props.history.push("/registration");
              }}
            >
              Refuser
            </CButton>
            <CButton className="btn btn-success" onClick={this.validateUser}>Valider</CButton>
          </div>
        </CCol>
      </>
    );
  }
}
