import styles from "./Input.module.css";

const Input = (props) => {
  return (
    <input
      ref={props.ref}
      className={styles.Input_text}
      type={props.type}
      placeholder={props.placeholder}
    >
      {props.children}
    </input>
  );
};

export default Input;
