import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { func } from 'prop-types';
import { Button, Form, Input, Label, FormGroup } from 'reactstrap';
import { salvarStore } from '../../actions';
import style from './Login.module.css';
import logo from '../../assets/trybelogo.png';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      validate: {
        validateEmail: false,
        validatePassword: false,
      },
      redirect: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.emailValidation = this.emailValidation.bind(this);
    this.passwordValidation = this.passwordValidation.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  emailValidation(email) {
    const { validate } = this.state;
    // const {email}=this.state;
    const regex = /\S+@\S+\.\S+/;
    if (regex.test(email)) {
      return this.setState({

        validate: {
          ...validate,
          validateEmail: true,
        },
      });
    }
    return this.setState({
      validate: {
        ...validate,
        validateEmail: false,
      },
    });
  }

  passwordValidation(password) {
    const { validate } = this.state;
    // const {password}=this.state;
    const sizeNumber = 6;
    if (password.length >= sizeNumber) {
      return this.setState({
        validate: {
          ...validate,
          validatePassword: true,
        },
      });
    }
    return this.setState({
      validate: {
        ...validate,
        validatePassword: false,
      },
    });
  }

  handleChange({ target }) {
    const { value, name } = target;
    if (name === 'email') {
      this.emailValidation(value);
      return this.setState({ [name]: value });
    } if (name === 'password') {
      this.passwordValidation(value);
      return this.setState({ [name]: value });
    }
  }

  handleClick() {
    const { sendEmail } = this.props;
    const { email } = this.state;
    sendEmail(email);
    return this.setState({ redirect: true });
  }

  renderForm() {
    const { validate, email, password } = this.state;
    return (
      <form className={ style.form }>
        <img
          className={ style.mobileLogo }
          src={ logo }
          alt="logo"
        />
        <label
          className={ style.labelsInputs }
          htmlFor="emailLabel"
        >
          <input
            className={ style.inputs }
            data-testid="email-input"
            placeholder="email"
            type="email"
            name="email"
            id="emailLabel"
            onChange={ this.handleChange }
            value={ email }
          />
        </label>

        <label
          className={ style.labelsInputs }
          htmlFor="password"
        >
          <input
            className={ style.inputs }
            data-testid="password-input"
            placeholder="password"
            type="password"
            name="password"
            id="passwordLabel"
            onChange={ this.handleChange }
            value={ password }
          />
        </label>

        <button
          color="primary"
          className={ style.btn }

          disabled={ !validate.validateEmail || !validate.validatePassword }
          onClick={ this.handleClick }
          type="button"
          id="button"
        >
          Login
        </button>
      </form>
    );
  }

  render() {
    const { redirect } = this.state;
    if (redirect) return <Redirect to="/carteira" />;
    return (
      <main className={ style.main }>

        <article className={ style.articleHeader }>
          <header className={ style.header } />
        </article>
        <article>
          {this.renderForm()}
        </article>
        <article className={ style.desktopArticlelogo }>
          <img
            className={ style.desktopLogo }
            src={ logo }
            alt="logo"
          />
        </article>
        <article className={ style.articleFooter }>
          <footer className={ style.footer }>
            <p>by_[MB]</p>
          </footer>
        </article>

      </main>
    );
  }
}

Login.propTypes = {
  sendEmail: func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  sendEmail: (email) => dispatch(salvarStore(email)),
});

export default connect(null, mapDispatchToProps)(Login);
