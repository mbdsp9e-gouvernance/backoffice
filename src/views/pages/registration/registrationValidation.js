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
    const personDetail = {
      username: "cedric004",
      lastName: "Rakotomaharo",
      surname: "Cedric",
      birthdate: "10/09/1989",
      address: "Lot IVB 300 Analamahitsy",
      email: "cedricrak@gmail.com",
      contact: "0340719284",
      gender: "Homme",
      date: "20/07/2023",
    };
    const enterpriseDetail = {
      username: "bici",
      name: "BICI",
      activity: "Développement informatique",
      nif: "198479237497427384",
      stat: "4340933940327470",
      place: "Lot AB123 Andoharanofotsy",
      email: "bicimg@moov.mg",
      contact: "0331176959",
      date: "21/07/2023",
    };
    setTimeout(() => {
      this.setState({
        details:
          this.props.match.params.id === "Personne"
            ? personDetail
            : enterpriseDetail,
        loading: false,
      });
    }, 1000);
  }

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
              {this.props.match.params.id && this.props.match.params.id === "Personne" && <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Nom d'utilisateur: </strong>
                    {details.username}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Nom: </strong>
                    {`${details.lastName} ${details.surname}`}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Date de naissance: </strong>
                    {details.birthdate}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Sexe: </strong>
                    {details.gender}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Contact: </strong>
                    {details.contact}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Email: </strong>
                    {details.email}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Adresse: </strong>
                    {details.address}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Date d'inscription: </strong>
                    {details.date}
                  </span>
                </CListGroupItem>
              </CListGroup>}
              {this.props.match.params.id && this.props.match.params.id === "Entreprise" && <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Nom d'utilisateur: </strong>
                    {details.username}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Nom: </strong>
                    {details.name}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Secteur d'activité: </strong>
                    {details.activity}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> NIF: </strong>
                    {details.nif}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> STAT: </strong>
                    {details.stat}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Contact: </strong>
                    {details.contact}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Email: </strong>
                    {details.email}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Siège social: </strong>
                    {details.place}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong> Date d'inscription: </strong>
                    {details.date}
                  </span>
                </CListGroupItem>
              </CListGroup>}
            </CCardBody>
          </CCard>
          <div className="mb-5 d-grid gap-2 d-md-flex justify-content-end">
            <CButton className="btn btn-danger">Refuser</CButton>
            <CButton className="btn btn-success">Valider</CButton>
          </div>
        </CCol>
      </>
    );
  }
}
