import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { addOrder } from '../redux/features/order/orderSlice';
import { createOrder } from '../redux/services/orderService';

const StripePaymentSuccess = () => {
    const dispatch = useDispatch();

    useEffect(() => {

        const storedOrderPayload = localStorage.getItem('orderPayload');
        const payload = storedOrderPayload ? JSON.parse(storedOrderPayload) : [];

        // Call the createOrder service

        createOrder(payload.userId, payload.items, payload.totalPrice, payload.cartId)
            .then((orderResponse: any) => {
                // Dispatch the addOrder action to update the order state
                dispatch(addOrder(orderResponse));

                // Display success message or redirect to a success page
                toast.success('Order placed successfully', {
                    position: "top-right",
                });
            })
            .catch((error) => {
                console.error('Error placing order:', error);
                // alert('Error placing order. Please try again.');
            });
    }, [dispatch]);

    return (
        <div>
            <h1>Payment Successful</h1>
        </div>
    );
};

export default StripePaymentSuccess;
