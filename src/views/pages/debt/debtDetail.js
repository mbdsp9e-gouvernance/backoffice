import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from "@coreui/react";
import api from "../../../const/api";

export default class DebtDetail extends React.Component {
  constructor(props) {
    const { match } = props;
    super(props);
    this.state = {
      debt_id: match && match.params && match.params.id,
      loading: true,
      debtDetail: null,
      history: false,
      error: "",
    };
  }

  componentDidMount() {
    this.getDebt();
  }

  getDebt() {
    this.setLoading(true);
    fetch(api(`debtDetails/${this.state.debt_id}`), { method: "GET" }).then(
      (res) => {
        if (res.ok)
          res.json().then((data) => {
            if (data && data.debtDetail)
              this.setState({
                debtDetail: data.debtDetail,
                loading: false,
              });
          });
      }
    );
  }

  // getDebtPayment() {
  //   this.setLoading(true);
  //   fetch(api(`debtPayment/${this.state.debt_id}`), { method: "GET" }).then(
  //     (res) => {
  //       if (res.ok) {
  //         res.json().then((data) => {
  //           if (data && data.total) {
  //             if (data.total.total != null) {
  //               this.setState({
  //                 history: false,
  //                 loading: false,
  //               });
  //             } else {
  //               this.setState({
  //                 history: true,
  //                 loading: false,
  //               });
  //             }
  //           }
  //         });
  //       }
  //     }
  //   );
  // }

  // DebtPayementDetail(id) {
  //   this.props.history.push("/debt/payment/" + id);
  // }
  returnToList() {
    this.props.history.push("/debt/list");
  }

  render() {
    const { debtDetail, loading } = this.state;
    return (
      <>
        {loading ? (
          <></>
        ) : (
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>
                    Details : Montant total {`=>`}{" "}
                    {debtDetail[0].totalAmountDebt > 1000 ? (
                      <>{debtDetail[0].totalAmountDebt.toLocaleString()} Ar</>
                    ) : (
                      <>{debtDetail[0].totalAmountDebt} Ar</>
                    )}
                  </strong>

                  {/* <CButton
                    color={"light"}
                    disabled={history}
                    onClick={() => this.DebtPayementDetail(debt_id)}
                  >
                    Historique Paiement
                  </CButton> */}

                  <CButton color={"light"} onClick={() => this.returnToList()}>
                    Retour
                  </CButton>
                </CCardHeader>
                <CCardBody>
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Service</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Quantité
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Prix unitaire
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Prix total
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {debtDetail &&
                        debtDetail.map((detail, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{detail.entitled}</CTableDataCell>

                            <CTableDataCell>{detail.quantity}</CTableDataCell>

                            <CTableDataCell>
                              {detail.unitPrice > 1000 ? (
                                <>{detail.unitPrice.toLocaleString()} Ar</>
                              ) : (
                                <>{detail.unitPrice} Ar</>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              {detail.totalAmount > 1000 ? (
                                <>{detail.totalAmount.toLocaleString()} Ar</>
                              ) : (
                                <>{detail.totalAmount} Ar</>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        )}
      </>
    );
  }

  setLoading(state) {
    this.setState({
      loading: state,
    });
  }
  setId(id) {
    this.setState({
      id: id,
    });
  }
}
