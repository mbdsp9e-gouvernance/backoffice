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
} from "@coreui/react";
import api from "../../../const/api";
import Loading from "../Loading";
import moment from "moment";

export default class PurchaseDetail extends React.Component {
  constructor(props) {
    const { match } = props;
    super(props);
    this.state = {
      purchase_id: match && match.params && match.params.id,
      loading: true,
      purchaseDetail: null,
      purchase: null,
      error: "",
    };
  }

  componentDidMount() {
    this.getPurchaseDetail();
  }

  getPurchaseDetail() {
    this.setLoading(true);
    fetch(api(`purchaseDetails/${this.state.purchase_id}`)).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.purchaseDetail) {
            this.getPurchase(data.purchaseDetail[0].purchaseId);
            this.setState({
              purchaseDetail: data.purchaseDetail,
              loading: false,
            });
          }
        });
    });
  }

  getPurchase(id) {
    this.setLoading(true);
    fetch(api(`purchase/${id}`)).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.purchase)
            this.setState({
              purchase: data.purchase,
              loading: false,
            });
        });
    });
  }

  render() {
    const { purchaseDetail, loading, purchase } = this.state;
    const style = {
      borderColor: "darkslategrey",
      borderStyle: "solid",
      borderWidth: "1px",
    };
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader></CCardHeader>
              <CCardBody>
                <div className="title">
                  <h1>Détails de l'achat</h1>
                </div>
                <div className="detail-purchase">
                  {purchase && purchase ? (
                    <div className="customer-purchase">
                      <div className="customer-detail">
                        {purchase.customer_id ? (
                          <>
                            <h5>
                              {purchase.customer_id.name}{" "}
                              {purchase.customer_id.surname}
                            </h5>
                            <h5>{purchase.customer_id.address}</h5>
                            <h5>{purchase.customer_id.number_phone}</h5>
                          </>
                        ) : (
                          <>
                            <h5>Aucun client</h5>
                            <h5>Aucune adresse</h5>
                            <h5>Aucun contact</h5>
                          </>
                        )}
                      </div>
                      <div className="info-purchase">
                        <div className="div-display">
                          <div className="date-ref-title">
                            <h5>Achat#</h5>
                            <h5>Date et Heure# </h5>
                          </div>
                          <div className="date-ref">
                            <h5>{purchase.id}</h5>
                            <h5>
                              {moment(purchase.purchase_datetime).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </h5>
                          </div>
                        </div>
                        <div className="info-received">
                          <h5>Reçu par:</h5>
                          <h5>
                            {purchase.received_by.name}{" "}
                            {purchase.received_by.surname}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {purchase && purchase ? (
                    <div className="info">
                      <div className="vendor-detail">
                        <h5>Vendeur</h5>
                        <div>
                          <h5>Creat'Or Service</h5>
                          <h5>Address</h5>
                          <h5>Madagascar</h5>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>

                <CTable>
                  <CTableHead style={{ backgroundColor: "grey", border: "1" }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Ref</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Designation
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Quantité</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Prix unitaire
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Prix total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {purchaseDetail &&
                      purchaseDetail.map((detail, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell style={style}>
                            {detail.id}
                          </CTableDataCell>
                          <CTableDataCell style={style}>
                            {detail.entitled}
                          </CTableDataCell>

                          <CTableDataCell style={style}>
                            {detail.quantity}
                          </CTableDataCell>

                          <CTableDataCell style={style}>
                            {detail.unitPrice > 1000 ? (
                              <>{detail.unitPrice.toLocaleString()} Ar</>
                            ) : (
                              <>{detail.unitPrice} Ar</>
                            )}
                          </CTableDataCell>
                          <CTableDataCell style={style}>
                            {detail.totalPrice > 1000 ? (
                              <>{detail.totalPrice.toLocaleString()} Ar</>
                            ) : (
                              <>{detail.totalPrice} Ar</>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
                {purchase && purchase ? (
                  <div className="total-div">
                    {purchaseDetail[0].totalAmountPurchase > 1000 ? (
                      <>
                        <b>
                          Total :
                          {purchaseDetail[0].totalAmountPurchase.toLocaleString()}{" "}
                          Ar
                        </b>
                      </>
                    ) : (
                      <>
                        <b>
                          Total : {purchaseDetail[0].totalAmountPurchase} {""}Ar
                        </b>
                      </>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
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
