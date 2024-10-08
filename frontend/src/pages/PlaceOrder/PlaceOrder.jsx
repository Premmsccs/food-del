import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });
    const [isTouching, setIsTouching] = useState(false); // State to manage touch effect

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const validateForm = () => {
        // Basic validations
        if (!data.firstName || !data.lastName || !data.email || !data.street || 
            !data.city || !data.state || !data.zipcode || !data.country || !data.phone) {
            toast.error("All fields are required.");
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            toast.error("Invalid email format.");
            return false;
        }

        // Phone number validation (must be exactly 10 digits)
        const phoneRegex = /^[0-9]{10}$/; // Updated to require exactly 10 digits
        if (!phoneRegex.test(data.phone)) {
            toast.error("Phone number must be exactly 10 digits long.");
            return false;
        }

        // Zip code validation (example: 5 digits)
        const zipRegex = /^[0-9]{6}$/; // Adjust according to your requirements
        if (!zipRegex.test(data.zipcode)) {
            toast.error("Zip code must be 6 digits.");
            return false;
        }

        return true;
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Stop if validation fails
        
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });
        
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
        };

        if (payment === "stripe") {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            } else {
                toast.error("Something Went Wrong");
            }
        } else {
            let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
            if (response.data.success) {
                navigate("/myorders");
                toast.success(response.data.message);
                setCartItems({});
            } else {
                toast.error("Something Went Wrong");
            }
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("To place an order, sign in first");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, getTotalCartAmount, navigate]);

    // Inline styles for the delivery info box
    const deliveryInfoStyle = {
        position: 'relative',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
    };

    const deliveryInfoHoverStyle = {
        backgroundColor: 'darkorange',
    };

    // Styles for cart total details with touch effect
    const cartTotalDetailsStyle = {
        color: isTouching ? 'darkorange' : 'black',
        transition: 'color 0.3s ease',
        cursor: 'pointer', // Add cursor pointer for touch effect
    };

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <div 
                    className="delivery-info" 
                    style={deliveryInfoStyle}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = deliveryInfoHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                    <p className='title'>Delivery Information</p>
                    <div className="multi-field">
                        <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                        <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                    </div>
                    <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                    <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                    <div className="multi-field">
                        <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                        <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                    </div>
                    <div className="multi-field">
                        <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                        <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                    </div>
                    <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
                </div>
            </div>
            <div className="place-order-right">
            <div 
                    className="cart-total" 
                    style={deliveryInfoStyle}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = deliveryInfoHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                    
                <div className="cart-total" style={{
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
                }}>
                    
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details" style={cartTotalDetailsStyle}>
                            <p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details" 
                             style={cartTotalDetailsStyle}
                             onTouchStart={() => setIsTouching(true)} // Set isTouching to true on touch
                             onTouchEnd={() => setIsTouching(false)} // Reset isTouching to false on touch end
                             onMouseEnter={() => setIsTouching(true)} // Optional: Keep it for mouse hover effect
                             onMouseLeave={() => setIsTouching(false)} // Optional: Reset for mouse leave
                        >
                            
                            <p>Delivery Fee</p>
                            <p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details" style={cartTotalDetailsStyle}>
                            <b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b>
                        </div>
                    </div>
                </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
            </div>
            
        </form>
    );
}

export default PlaceOrder;
