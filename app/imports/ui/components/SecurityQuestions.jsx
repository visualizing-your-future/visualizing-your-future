import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

const SecurityQuestions = ({ securityQuestion, setSecurityQuestion, securityAnswer, setSecurityAnswer }) => {
  const questions = [
    'What is the name of your first childhood pet?',
    'What is the middle name of your oldest cousin?',
    'In which city did your parents meet?',
    'What was the name of your school physical education teacher?',
    'What is your favorite sport?',
    'What was the name of the boy or girl you first kissed?',
    'What is the middle name of your youngest child?',
    'What was the first exam you failed?',
  ];

  const handleQuestionChange = (e) => {
    setSecurityQuestion(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setSecurityAnswer(e.target.value);
  };

  return (
    <div className="mt-3">
      <h4>Set Your Security Question</h4>
      <Form.Group controlId="securityQuestion">
        <Form.Label>Select a security question</Form.Label>
        <Form.Control
          as="select"
          value={securityQuestion || ''} // Ensure value is a string and not undefined/null
          onChange={handleQuestionChange}
        >
          <option value="">Select a question...</option>
          {questions.map((q, index) => (
            <option key={index} value={q}>
              {q}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="securityAnswer" className="mt-3">
        <Form.Label>Answer</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your answer"
          value={securityAnswer || ''} // Ensure value is a string and not undefined/null
          onChange={handleAnswerChange}
        />
      </Form.Group>
    </div>
  );
};

SecurityQuestions.propTypes = {
  securityQuestion: PropTypes.string.isRequired,
  setSecurityQuestion: PropTypes.func.isRequired,
  securityAnswer: PropTypes.string.isRequired,
  setSecurityAnswer: PropTypes.func.isRequired,
};

export default SecurityQuestions;
