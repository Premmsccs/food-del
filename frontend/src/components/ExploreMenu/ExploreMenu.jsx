import React, { useContext, useState } from 'react';
import './ExploreMenu.css';
import { StoreContext } from '../../Context/StoreContext';

const ExploreMenu = ({ category, setCategory }) => {
  const { menu_list } = useContext(StoreContext);
  const [isHovered, setIsHovered] = useState(false); // State to manage hover effect

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p
        style={{
          color: isHovered ? 'darkorange' : 'green', // Change color on hover
          fontWeight: 'bold',
          transition: 'color 0.3s ease, transform 0.3s ease', // Smooth transition effect
          transform: isHovered ? 'scale(1.05)' : 'scale(1)', // Scale up on hover
        }}
        onMouseEnter={() => setIsHovered(true)} // Set hover state to true
        onMouseLeave={() => setIsHovered(false)} // Reset hover state to false
      >
        Choose from a diverse menu featuring a delectable array of dishes.<br />
        Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.<br />
        Don'T Waste Your Time To Search...! Just simply View explore Menu There Will be YourFavourites..Enjoy
      </p>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
              key={index}
              className='explore-menu-list-item'
            >
              <img
                src={item.menu_image}
                className={category === item.menu_name ? "active" : ""}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
