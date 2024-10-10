export default function Button(props): JSX.Element {
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