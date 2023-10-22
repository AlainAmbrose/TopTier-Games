import react from "react";

function SignUpButton() {
  const doSignUp = async (event) => {
    event.preventDefault();
    window.location.href = "/signup";
  };
  return (
    <div id="signUpButtonDiv">
      <form>
        <input
          type="submit"
          id="signUpButton"
          className="buttons signup-button"
          value="Sign Up"
          onClick={doSignUp}
        />
      </form>
    </div>
  );
}
export default SignUpButton;
