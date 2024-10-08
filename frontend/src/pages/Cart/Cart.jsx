import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, currency, deliveryCharge } = useContext(StoreContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [hovered, setHovered] = useState(false); // State to manage hover effect

  const totalCartAmount = getTotalCartAmount();
  const minimumAmountForPromo = 200; // Minimum amount to be eligible for promo code
  const discountPercentage = 25; // Discount percentage for the promo code

  // Function to generate a random promo code
  const generatePromoCode = () => {
    if (totalCartAmount > minimumAmountForPromo) {
      const code = `PROMO${Math.floor(1000 + Math.random() * 9000)}`; // Random 4-digit code
      setPromoCode(code);
      alert(`You are eligible for a promo code! Use code: ${code} for a 25% discount.`);
    } else {
      alert('Your cart total must be more than Rs. 200 to receive a promo code.');
    }
  };

  // Function to apply promo code and calculate discount
  const applyPromoCode = () => {
    if (promoCode && appliedPromoCode === null) {
      setDiscount((totalCartAmount * discountPercentage) / 100);
      setAppliedPromoCode(promoCode);
      alert('Promo code applied! You have received a 25% discount.');
    } else {
      alert('Invalid promo code or promo code already applied.');
    }
  };

  // Effect to clear promo code if cart total is below the minimum amount
  useEffect(() => {
    if (totalCartAmount < minimumAmountForPromo) {
      setPromoCode(''); // Clear promo code
      setAppliedPromoCode(null); // Reset applied promo code
      setDiscount(0); // Reset discount
    }
  }, [totalCartAmount, minimumAmountForPromo]);

  return (
    <div className='cart' style={styles.cart}>
      <div className="cart-items" style={styles.cartItems}>
        <div className="cart-items-title" style={styles.cartItemsTitle}>
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item" style={styles.cartItemsItem}>
                  <img src={url + "/images/" + item.image} alt="" style={styles.cartItemImage} />
                  <p>{item.name}</p>
                  <p>{currency}{item.price}</p>
                  <div>{cartItems[item._id]}</div>
                  <p>{currency}{item.price * cartItems[item._id]}</p>
                  <p style={styles.cartItemsRemoveIcon} onClick={() => removeFromCart(item._id)}>x</p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>

      <div className="cart-bottom" style={styles.cartBottom}>
        <div 
          className="cart-total" 
          style={{
            ...styles.cartTotal, 
            backgroundColor: hovered ? '#FF8C00' : '#f9f9f9' // Change background based on hovered state
          }}
          onMouseEnter={() => setHovered(true)} 
          onMouseLeave={() => setHovered(false)} // Toggle hover state
        >
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details" style={styles.cartTotalDetails}>
              <p>Subtotal</p>
              <p>{currency}{totalCartAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details" style={styles.cartTotalDetails}>
              <p>Delivery Fee</p>
              <p>{currency}{totalCartAmount === 0 ? 0 : deliveryCharge}</p>
            </div>
            <hr />
            {discount > 0 && (
              <div className="cart-total-details" style={styles.cartTotalDetails}>
                <p>Discount (25%)</p>
                <p>-{currency}{discount}</p>
              </div>
            )}
            <hr />
            <div className="cart-total-details" style={styles.cartTotalDetails}>
              <b>Total</b>
              <b>{currency}{totalCartAmount === 0 ? 0 : totalCartAmount + deliveryCharge - discount}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')} style={styles.proceedButton}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode" 
          style={{
            ...styles.cartTotal, // Apply the same styles as the cart total
            marginLeft: '20px' // Add margin for spacing
          }}
        >
          <div>
            <p>
            You have a promo code to buy  a foods on Above 200rs</p>
            <div className='cart-promocode-input' style={styles.cartPromocodeInput}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder='Promo code'
                style={styles.input}
              />
              <button onClick={applyPromoCode} style={styles.submitButton}>Submit</button>
            </div>
            <button onClick={generatePromoCode} style={styles.generatePromoButton}>
              Get Your Promo Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

const styles = {
  cart: {
    padding: '20px',
    animation: 'fadeIn 0.5s', // Add fadeIn animation
  },
  cartItems: {
    marginBottom: '20px',
  },
  cartItemsTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  },
  cartItemsItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    transition: 'transform 0.3s',
  },
  cartItemImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '5px',
  },
  cartItemsRemoveIcon: {
    cursor: 'pointer',
    color: 'red',
    fontWeight: 'bold',
  },
  cartBottom: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cartTotal: {
    width: '50%',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, background-color 0.3s', // Added transition for background color
  },
  cartTotalDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  proceedButton: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  },
  cartPromocodeInput: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  input: {
    padding: '8px',
    width: '70%',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    padding: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  generatePromoButton: {
    marginTop: '15px',
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

// Add keyframes for animations
const fadeIn = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}`;

// Inject the styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = fadeIn;
document.head.appendChild(styleSheet);
