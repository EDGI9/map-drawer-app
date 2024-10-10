import React from 'react';
import { ButtonInterface} from "../interfaces/components";

const Button: React.FC<ButtonInterface> = (props)=> {
    function buttonClick() {
        if (!props.onClick) {
            return
        }
        
        props.onClick()
    }

    return (
        <button data-testid="qa-button" className='c-button' onClick={() => buttonClick()}>{props.text}</button>
    ) 
}

export default Button;