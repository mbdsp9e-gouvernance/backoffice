import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CButton,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilPencil, cilPlus } from "@coreui/icons";
import api from "../../../const/api";

export default class ListExpenseCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalState: false,
      deleteModalState: false,
      loading: true,
      expenseCategory: null,
      error: "",
      id: 0,
      offset: 0,
      limit: 0,
    };
  }

  componentDidMount() {
    this.getExpenseCategory();
  }

  cancelFormModal = () => {
    this.setFormModalState(false);
    this.clearFields();
    this.setError();
  };

  deleteExpense() {
    fetch(
      api(`expenseCategory/${this.state.expenseCategory[this.state.id].id}`),
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) {
        const tmp = [...this.state.expenseCategory];
        tmp.splice(this.state.id, 1);
        this.setState({
          expenseCategory: tmp,
        });
        this.setDeleteModalState(false);
      }
    });
  }

  expenseToDelete(index) {
    this.setId(index);
    this.setDeleteModalState(true);
  }

  getExpenseCategory() {
    this.setLoading(true);
    fetch(api(`expenseCategory/${this.state.offset}/${this.state.limit}`)).then(
      (res) => {
        if (res.ok)
          res.json().then((data) => {
            if (data && data.expenseCategory)
              this.setState({
                expenseCategory: data.expenseCategory,
              });
          });
      }
    );
    this.setLoading(false);
  }

  expenseUpdate(id) {
    this.props.history.push("/expenseCategory/update/" + id);
  }

  addExpenseCategory() {
    this.props.history.push("/expenseCategory/insert");
  }

  render() {
    const { expenseCategory, loading, deleteModalState, id } = this.state;
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <span className="d-grid gap-2 d-md-flex justify-content-between">
                  <strong>Liste des categories de sortie</strong>
                  <CButton
                    color={"primary"}
                    onClick={() => this.addExpenseCategory()}
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Ajouter
                  </CButton>
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Intitule</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {loading ? (
                      <></>
                    ) : (
                      expenseCategory &&
                      expenseCategory.map((e, index) => (
                        <CTableRow key={e.id}>
                          <CTableDataCell>{e.id}</CTableDataCell>
                          <CTableDataCell>{e.entitled}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"light"}
                              onClick={() => this.expenseUpdate(e.id)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"danger"}
                              onClick={() => this.expenseToDelete(index)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CModal
          alignment="center"
          visible={deleteModalState}
          onClose={() => this.setDeleteModalState(false)}
        >
          <CModalHeader>
            <CModalTitle>Supprimer</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>
              Voulez vous supprimer{" "}
              {expenseCategory &&
                expenseCategory.length > 0 &&
                id < expenseCategory.length &&
                expenseCategory[id].entitled}
              ?
            </p>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => this.setDeleteModalState(false)}
            >
              Annuler
            </CButton>
            <CButton color="danger" onClick={() => this.deleteExpense()}>
              Supprimer
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  }

  setOffset = (o) => {
    this.setState({
      offset: o,
    });
  };
  setLimit = (l) => {
    this.setState({
      limit: l,
    });
  };
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
  setDeleteModalState(modal) {
    this.setState({
      deleteModalState: modal,
    });
  }
}
