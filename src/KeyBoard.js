import React from 'react'
import PropTypes from 'prop-types'

import './KeyBoard.css'


const KeyBoard = ({ letter, feedback, onClick }) => (
  <button  className={`letter btn btn-primary my-2 ${feedback}`} onClick={() => onClick(letter)}>
      {letter}
  </button>
)
KeyBoard.propTypes = {
  letter: PropTypes.string.isRequired,
  feedback: PropTypes.oneOf([
    'letterMatched',
    'letterUnmatched',
    'unPressed'
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
}
export default KeyBoard
