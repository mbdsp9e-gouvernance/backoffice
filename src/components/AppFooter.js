import React from "react";
import { CFooter } from "@coreui/react";

class AppFooter extends React.Component {
  render() {
    return (
      <CFooter>
        <div>
          <span className="ms-1">
            &copy; 2023 V.{process.env.REACT_APP_VERSION}
          </span>
        </div>
        <div className="ms-auto">
          <span className="me-1">Powered by</span>
          E-gouvernance
        </div>
      </CFooter>
    );
  }
}

export default React.memo(AppFooter);
