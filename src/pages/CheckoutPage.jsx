const CheckoutPage = () => (
    <section>
      <div className="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
        />
        <div className="description">
        <h3>Stubborn Attachments</h3>
        <h5>$25.00</h5>
        </div>
      </div>
      <form action="/create-checkout-session" method="POST">
        <button type="submit">
          Checkout
        </button>
      </form>
    </section>
  );

const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );

  export default CheckoutPage;