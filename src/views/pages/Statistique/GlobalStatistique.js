import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CRow,
  CButton,
  CCol,
} from "@coreui/react";
import api from "../../../const/api";
import Loading from "../Loading";
export default class GlobalStatistique extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataMonthEntry: [1423, 2874],
      dataMonthExpense: [9172, 6821],
      dataMonthBenefit: [3800, 2891],
      labels: ["Analamanga", "Vakinakaratra"],
      firstDate: "",
      secondDate: "",
      totalMonth: [],
      typeFilter: 0,
      tenders: 0,
      soumissions: 0,
      reussite: 0,
    };
  }
  componentDidMount() {
    this.getTenderCount();
    this.getSoumissionCount();
    this.getReussiteCount();
  }

  getTenderCount() {
    let wheres = [];
    if (this.state.firstDate !== "")
      wheres.push(`date1=${this.state.firstDate}`);
    if (this.state.secondDate !== "")
      wheres.push(`date2=${this.state.secondDate}`);
    wheres = wheres.join('&');
    if(wheres!=='') wheres=`?${wheres}`;
    this.setLoading(true);
    fetch(api(`tenders/count${wheres}`), { method: "GET" }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            tenders: data.count,
          });
          this.setLoading(false);
        });
      }
    });
  }

  getSoumissionCount() {
    let wheres = [];
    if (this.state.firstDate !== "")
      wheres.push(`date1=${this.state.firstDate}`);
    if (this.state.secondDate !== "")
      wheres.push(`date2=${this.state.secondDate}`);
    wheres = wheres.join('&');
    if(wheres!=='') wheres=`?${wheres}`;
    this.setLoading(true);
    fetch(api(`soumissions/count${wheres}`), { method: "GET" }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            soumissions: data.count,
          });
          this.setLoading(false);
        });
      }
    });
  }

  getReussiteCount() {
    let wheres = [];
    if (this.state.firstDate !== "")
      wheres.push(`date1=${this.state.firstDate}`);
    if (this.state.secondDate !== "")
      wheres.push(`date2=${this.state.secondDate}`);
    wheres = wheres.join('&');
    if(wheres!=='') wheres=`?${wheres}`;
    this.setLoading(true);
    fetch(api(`soumissions/reussite${wheres}`), { method: "GET" }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            reussite: data.count,
          });
          this.setLoading(false);
        });
      }
    });
  }

  filter = () => {
    this.getTenderCount();
    this.getSoumissionCount();
  }

  setTypeFilter = (e) => {
    this.setState({
      typeFilter: e.target.value,
    });
  };

  render() {
    const { loading, firstDate, secondDate } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <div className="mb-3 bg-light min-vh-50 d-flex flex-row">
          <div style={{ width: "100%" }}>
            <CCard>
              <CCardHeader>Filtres</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol>
                    <CInputGroup className="mb-3">
                      <CInputGroupText component="label" htmlFor="debut">
                        Début
                      </CInputGroupText>
                      <CFormInput
                        id="debut"
                        type="date"
                        placeholder="Debut"
                        autoComplete="date"
                        value={firstDate}
                        onChange={this.setFirstDate}
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol>
                    <CInputGroup className="mb-3">
                      <CInputGroupText component="label" htmlFor="fin">
                        Fin
                      </CInputGroupText>
                      <CFormInput
                        id="fin"
                        type="date"
                        placeholder="Fin"
                        autoComplete="date"
                        value={secondDate}
                        onChange={this.setSeconDate}
                      />
                    </CInputGroup>
                  </CCol>
                  {/* <CCol>
                    <CInputGroup style={{ height: "30px" }}>
                      <CInputGroupText component="label" htmlFor="offerType">
                        Type
                      </CInputGroupText>
                      <CFormSelect
                        id="offerType"
                        onChange={this.setTypeFilter}
                        value={typeFilter}
                        required
                      >
                        <option value={0}>Tous</option>
                        <option value={1}>Ouvert</option>
                        <option value={2}>Restreint</option>
                        <option value={3}>Préséléction</option>
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>
                  <CCol>
                    <CInputGroup style={{ width: "250px", height: "30px" }}>
                      <CInputGroupText component="label" htmlFor="offerType">
                        Région
                      </CInputGroupText>
                      <CFormSelect
                        id="offerType"
                        onChange={this.setTypeFilter}
                        value={typeFilter}
                        required
                      >
                        <option value={0}>Tous</option>
                        <option value={1}>Analamanga</option>
                        <option value={2}>Vakinakaratra</option>
                        <option value={3}>Alaotra</option>
                      </CFormSelect>
                    </CInputGroup>
                  </CCol> */}
                  <CCol>
                    <CButton style={{ width: "100%" }} onClick={this.filter}>Afficher</CButton>
                  </CCol>
                </CRow>
                {/* <CRow className="align-items-end">
                </CRow> */}
              </CCardBody>
            </CCard>
          </div>
        </div>
        <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
          <div className="statistique-card">
            <CCard>
              <CCardHeader>Appels d'offres</CCardHeader>
              <CCardBody>
                <CCardTitle className="stat-title">
                  {this.state.tenders}
                </CCardTitle>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader>Soumissions</CCardHeader>
              <CCardBody>
                <CCardTitle className="stat-title">
                  {this.state.soumissions}
                </CCardTitle>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader>Taux de réussite</CCardHeader>
              <CCardBody>
                <CCardTitle className="stat-title">{Number(this.state.reussite).toPrecision(2)}%</CCardTitle>
              </CCardBody>
            </CCard>
          </div>
        </div>
        <br></br>
        <div>
          {/* <CCard>
            <CCardHeader>Nombre de soummissions</CCardHeader>
            <CCardBody>
              <CChart
                type="bar"
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: "Janvier",
                      backgroundColor: "#198754",
                      borderColor: "#198754",
                      borderWidth: 1,

                      data: dataMonthEntry,
                    },
                    {
                      label: "Fevrier",
                      backgroundColor: "#198754",
                      borderColor: "#198754",
                      borderWidth: 1,

                      data: dataMonthExpense,
                    },
                    {
                      label: "Mars",
                      backgroundColor: "#198754",
                      borderColor: "#198754",
                      borderWidth: 1,
                      data: dataMonthBenefit,
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard> */}
        </div>
      </>
    );
  }
  setLoading(state) {
    this.setState({
      loading: state,
    });
  }

  setFirstDate = (e) => {
    this.setState({
      firstDate: e.target.value,
    });
  };
  setSeconDate = (e) => {
    this.setState({
      secondDate: e.target.value,
    });
  };
}
