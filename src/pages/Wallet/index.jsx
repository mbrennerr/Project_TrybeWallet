import React, { Component } from 'react';
import { func, arrayOf, string } from 'prop-types';
import { connect } from 'react-redux';
import { RiHome2Line } from 'react-icons/ri';
import { Button,
  Form,
  Input,
  Label,
  InputGroupAddon,
  InputGroup,
  InputGroupText } from 'reactstrap';
import { sendExpenseApi, sendMoedasApi } from '../../actions';
import Moedas from '../../components/Moedas';
import style from './wallet.module.css';

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      value: '',
      description: '',
      currency: 'BRL',
      method: '',
      tag: '',
    };
    this.renderHeader = this.renderHeader.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.change = this.change.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.sumExpenses = this.sumExpenses.bind(this);
  }

  componentDidMount() {
    const { dispatchMoedas } = this.props;
    dispatchMoedas();
  }

  change({ target }) {
    const { id, value } = target;
    this.setState({
      [id]: value,
    });
  }

  submitForm(e) {
    e.preventDefault();
    const { buttonExpenses } = this.props;
    const { id, value, description, currency, method, tag } = this.state;
    const estado = { id, value, description, currency, method, tag };
    this.setState({
      id: id + 1,
      value: '',
      description: '',
      currency: 'BRL',
      method: '',
      tag: '',
    },
    () => buttonExpenses(estado));
  }

  sumExpenses() {
    const { cotation } = this.props;
    let contador = 0;
    cotation
      .forEach(({ value, currency, exchangeRates }) => {
        if (exchangeRates[currency]) {
          contador += (Number(value) * Number(exchangeRates[currency].ask));
          return contador;
        }
        return contador;
      });
    return contador.toFixed(2);
  }

  renderHeader() {
    const { salvarStore } = this.props;
    return (
      <header className={ style.header }>
        <section data-testid="email-field">{`Email: ${salvarStore}`}</section>
        <section data-testid="total-field">{ this.sumExpenses() }</section>
        <section data-testid="header-currency-field">Moeda: BRL</section>
        <a
          className={ style.homeButton }
          href="/"
        >
          <RiHome2Line
            color="rgba(0, 0, 0, 0.6)"
            size={ 25 }
          />
        </a>
      </header>
    );
  }

  renderButton() {
    return (
      <span>
        <Button
          type="submit"
        >
          Add
        </Button>
      </span>
    );
  }

  renderValue() {
    const { value } = this.state;
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Value</InputGroupText>
        </InputGroupAddon>
        <Input
          type="number"
          id="value"
          onChange={ this.change }
          value={ value }
          placeholder="Type Value"
        />
      </InputGroup>
    );
  }

  renderDescription() {
    const { description } = this.state;
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Description</InputGroupText>
        </InputGroupAddon>
        <Input placeholder="Descrição" type="text" id="description" onChange={ this.change } value={ description } />
      </InputGroup>
    );
  }

  renderCurrency() {
    const { currency } = this.state;
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Currency:</InputGroupText>
        </InputGroupAddon>
        <Input placeholder="Moeda" type="select" id="currency" onChange={ this.change } value={ currency }>
          <Moedas />
        </Input>
      </InputGroup>
    );
  }

  renderPaymentForm() {
    const { method } = this.state;
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Payment</InputGroupText>
        </InputGroupAddon>
        <Input placeholder="Forma de pagamento" type="select" id="method" onChange={ this.change } value={ method }>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de crédito">Cartão de crédito</option>
          <option value="Cartão de débito">Cartão de débito</option>
        </Input>
      </InputGroup>
    );
  }

  renderTag() {
    const { tag } = this.state;
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Tag</InputGroupText>
        </InputGroupAddon>
        <Input
          type="select"
          id="tag"
          onChange={ this.change }
          value={ tag }
        >
          <option value="Alimentação">Alimentação</option>
          <option value="Lazer">Lazer</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Transport">Transporte</option>
          <option value="Saúde">Saúde</option>
        </Input>
      </InputGroup>
    );
  }

  render() {
    return (
      <main className={ style.main }>
        <article
          className={ style.articleHeader }
        >
          {this.renderHeader()}
        </article>
        <article
          className={ style.articleFormMenu }
        >
          <Form
            className={ style.formMenu }
            onSubmit={ this.submitForm }
          >
            {this.renderValue()}
            {this.renderDescription()}
            {this.renderCurrency()}
            {this.renderPaymentForm()}
            {this.renderTag()}
            {this.renderButton()}
          </Form>
        </article>
        <article className={ style.articleTabel }>
          <h1>
            Tabela
          </h1>
        </article>
        <article className={ style.articleFooter }>
          <h1>
            by-[MB]
          </h1>
        </article>

      </main>
    );
  }
}

Wallet.propTypes = {
  salvarStore: func.isRequired,
  dispatchMoedas: func.isRequired,
  buttonExpenses: func.isRequired,
  forEach: func.isRequired,
  cotation: arrayOf(string).isRequired,
};

const mapStateToProps = (state) => ({
  salvarStore: state.user.email,
  cotation: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchMoedas: () => dispatch(sendMoedasApi()),
  buttonExpenses: (state) => dispatch(sendExpenseApi(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
