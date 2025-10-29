interface Properties {
  _onKeydown: any;
  _onChange: any;
  _placeHolder: string;
  _id: string;
  labelText: string;
}

const AuthenticationFields = (props: Properties) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          aria-label="alias"
          size={50}
          id={props._id}
          placeholder={props._placeHolder}
          onKeyDown={props._onKeydown}
          onChange={(event) => props._onChange(event.target.value)}
        />
        <label htmlFor={props._id}>{props.labelText}</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
