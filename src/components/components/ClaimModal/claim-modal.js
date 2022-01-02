import React from "react";
import { Modal, Button } from "react-bootstrap";

import "./claim-modal.scss";

export const ClaimModal = (props) => {
    const { manaStone, claimManaStone, ...rest } = props
  return (
    <Modal
      {...rest}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="row">
          <div className="col mana-stone-claim">
            <img src="./img/crystal.png" alt="crystal" className="crystal" />
            <h1>{manaStone}</h1>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={claimManaStone}>Claim</Button>
      </Modal.Footer>
    </Modal>
  );
};
