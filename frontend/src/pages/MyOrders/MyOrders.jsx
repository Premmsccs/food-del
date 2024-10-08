import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [trackingInfo, setTrackingInfo] = useState(null); // To store tracking data
  const { url, token, currency } = useContext(StoreContext);

  // Fetch user's orders
  const fetchOrders = async () => {
    if (!token) return; // Guard clause to prevent fetching without token

    try {
      const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        console.error("No orders found in response");
      }
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  // Track a specific order by ID
  const trackOrder = async (orderId) => {
    console.log(`Tracking order with ID: ${orderId}`);  // Log the order ID
    try {
      const response = await axios.get(`${url}/api/order/trackorder/${orderId}`, { headers: { token } });
      if (response.data) {
        console.log("Tracking Response:", response.data);  // Log the tracking response
        
        // Update the tracking info with the response
        setTrackingInfo({
          status: response.data.status,
          estimatedDelivery: response.data.estimatedDelivery,
          lastUpdated: response.data.lastUpdated,
          orderId: orderId,  // Use orderId passed to the function
        });
      } else {
        console.error("No tracking data found");
      }
    } catch (error) {
      console.error("Error tracking order", error);  // Log any errors
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders when the component mounts or when token changes
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <p>No orders found.</p> // Show message if no orders are present
        ) : (
          data.map((order) => (
            <div key={order._id} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="parcel icon" />
              <p>
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}{idx < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p>{currency}{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.status}</b></p>
              {/* Track Order Button */}
              <button className='track-order-btn' onClick={() => trackOrder(order._id)}>Track Order</button>
            </div>
          ))
        )}
      </div>

      {/* Display tracking information when available */}
      {trackingInfo && (
        <div className="tracking-info">
          <h3>Tracking Information for Order ID: {trackingInfo.orderId}</h3>
          <p><b>Status:</b> {trackingInfo.status}</p>
          <p><b>Expected Delivery:</b> {trackingInfo.estimatedDelivery}</p>
          <p><b>Last Updated:</b> {trackingInfo.lastUpdated}</p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
