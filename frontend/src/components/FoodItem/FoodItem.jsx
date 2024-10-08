import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom'; // Import for navigation

const FoodItem = ({ image, name, price, desc, id }) => {
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const navigate = useNavigate(); // Hook for navigation

    const handleAddToCart = () => {
        addToCart(id);
        setShowPopup(true); // Show the popup when item is added
        setTimeout(() => setShowPopup(false), 2000); // Hide popup after 2 seconds
    };

    const handleNavigateToCart = () => {
        navigate('/cart'); // Navigate to the cart page
    };

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
                {!cartItems[id] ? (
                    <img className='add' onClick={handleAddToCart} src={assets.add_icon_white} alt="Add to cart" />
                ) : (
                    <div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="Remove from cart" />
                        <p>{cartItems[id]}</p>
                        <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="Add more" />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating stars" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{currency}{price}</p>
            </div>
            {showPopup && (
                <div className="popup-message">
                    Item added to cart!
                    <button onClick={handleNavigateToCart} className="popup-button">Go to Cart</button>
                </div>
            )}
            <style jsx>{`
                .food-item {
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    overflow: hidden;
                    transition: box-shadow 0.3s, transform 0.3s; /* Add transition for transform */
                    position: relative; /* Ensure popup is positioned correctly */
                    perspective: 1000px; /* Enable perspective for 3D effect */
                }

                .food-item:hover {
                    box-shadow: 0 0 20px rgba(255, 140, 0, 0.7); /* Dark orange glow effect */
                    transform: scale(1.05) rotateY(5deg) rotateX(5deg); /* 3D effect */
                }

                .food-item-img-container {
                    position: relative;
                }

                .food-item-image {
                    width: 100%;
                    height: auto;
                }

                .add {
                    position: absolute;
                    bottom: 10px; /* Position at the bottom */
                    right: 10px; /* Position to the right */
                    cursor: pointer;
                }

                .food-item-counter {
                    display: flex;
                    align-items: center;
                }

                .food-item-counter img {
                    cursor: pointer;
                    margin: 0 5px;
                }

                .food-item-info {
                    padding: 10px;
                }

                .food-item-name-rating {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .food-item-desc {
                    color: #757575;
                    font-size: 14px;
                }

                .food-item-price {
                    font-weight: bold;
                    font-size: 16px;
                    color: #333;
                }

                .popup-message {
                    background-color: orange; /* Set the background color to orange */
                    color: white; /* Set text color to white */
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px; /* Space from the item info */
                    display: flex;
                    justify-content: space-between; /* Aligns the text and button */
                    align-items: center; /* Centers text vertically */
                }

                .popup-button {
                    background-color: white;
                    color: orange;
                    border: none;
                    border-radius: 5px;
                    padding: 5px 10px;
                    cursor: pointer;
                    margin-left: 10px; /* Spacing between text and button */
                }

                .popup-button:hover {
                    background-color: rgba(255, 255, 255, 0.8);
                }
            `}</style>
        </div>
    );
};

export default FoodItem;
