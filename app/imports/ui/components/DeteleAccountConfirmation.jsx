import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Button, Modal, Form } from 'react-bootstrap';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
// import LoadingSpinner from './LoadingSpinner';
import { removeItMethod } from '../../api/base/BaseCollection.methods';

/**
 * DeleteAccountConfirmation Component
 * This component manages the pop-up asking for a confirmation that the user would like to delete their account.
 * This is to prevent accidental account deletion.
 */
const DeleteAccountConfirmation = (show, onHide, collectionName, documentID) => {
  const [typedUsername, setTypedUsername] = useState('');
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const navigate = useNavigate();
  const username = collectionName; // Replace with the actual username

  const handleUsernameChange = (e) => {
    const input = e.target.value;
    setTypedUsername(input);
    setDeleteEnabled(input === username);
  };

  const handleDeleteAccount = () => {
    removeItMethod.callPromise({ collectionName: collectionName, instance: documentID });
    navigate('../pages/Landing');
    onHide();
    // <Alert variant="success" dismissible>The account has been successfully delete!</Alert>;
  };

  return (
    <Container id={COMPONENT_IDS.DELETE_ACCOUNT_CONFIRMATION}>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <Form>
            <Form.Group controlId="confirmUsername">
              <Form.Label>Please re-type the username to confirm this action. Type: {collectionName}</Form.Label>
              <Form.Control
                type="text"
                value={typedUsername}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button
            id={COMPONENT_IDS.DELETE_USER_ACCOUNT}
            variant="danger"
            disabled={!deleteEnabled}
            onClick={handleDeleteAccount}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeleteAccountConfirmation;
