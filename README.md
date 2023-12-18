## Local URL

To run the project on a local environment with a local backend server, use the following URL: [http://localhost:3000/](http://localhost:3000/)

## Start Commands According to Environment

- To run the project on a local environment with a local backend server: `npm start`

## Main File

The entry point for the backend is `index.ts`.

## Database Name

This project uses Mongodb as its database.

## Getting Started

To get started, follow these steps:

1. Install the project dependencies using:

```shell
npm install
```
## What this does
- Register yourself as Admin or User
- Admin can view manage-products page & User can view only dashboard page
- Admin can do crud on products which will be updated in dashboard
- User can add products to cart & do final checkout
- For test payment refer these
    - https://stripe.com/docs/testing#international-cards && https://secure.utah.gov/datarequest/zipcodes.html
    - add the card number & pin will be 3 or 4 digits, also need to add address, than it works
    - on payment success, it will redirect to order-success page
    - if clicked on Back/cancel payment, it will redirect to order-cancel page

## This is stage 1, more improvements in terms of redux optimization & bug fixing will be there, but right now the flow is working