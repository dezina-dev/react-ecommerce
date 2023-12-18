import React from 'react';
import '../css/CartItem.css';

interface CartItemProps {
  item: {
    _id: string;
    userId: string;
    items: {
      productId: string;
      quantity: number;
      productData: {
        _id: string;
        name: string;
        image: string;
        description: string;
        price: number;
      }[];
    };
  };
  onIncrement: (productId: string, user_id: string) => void;
  onDecrement: (productId: string, user_id: string) => void;
  onRemove: (productId: string, user_id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrement, onDecrement, onRemove }) => {
  const { productId, quantity, productData } = item.items;
  let user_id = item.userId
  // Check if the quantity exists
  if (quantity === undefined) {
    return null; // If quantity is undefined, don't render the item
  }

  return (
    <div className="cart-item">
      <img src={productData[0].image} alt={productData[0].name} />
      <div className="item-details">
        <span className="name">{productData[0].name}</span>
        <span className="quantity">
          <button onClick={() => onDecrement(productId, user_id)}>-</button>
          {quantity}
          <button onClick={() => onIncrement(productId, user_id)}>+</button>
        </span>
        <span className="price">{productData[0].price}</span>
        <button className="remove-item" onClick={() => onRemove(productId, user_id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
