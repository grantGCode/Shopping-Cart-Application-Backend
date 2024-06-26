try {
  require('dotenv').config();
} catch (error) {
  console.error('Error loading .env file:', error);
}
const stripeKey = process.env.REACT_APP_STRIPE_API_KEY;
const express = require('express');
const cors = require('cors');
const app = express();
const stripe = require('stripe')(stripeKey);
const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors({
  origin: 'https://secure-swift-shoppers-cart.netlify.app'
}));


app.post('/', async (req, res) => {
  try{
    const Items = req.body
    const lineItems = Items.map((item)=>{
      return {
        price: item.stripeId, 
        quantity: item.quantity
      }
    });   

    if(lineItems === undefined || 
      !Array.isArray(lineItems)) {
        console.error('Line Items is not set as a array.');
        return null;
    };

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://secure-swift-shoppers-cart.netlify.app/success',
      cancel_url:  'https://secure-swift-shoppers-cart.netlify.app/cancel',
    })
    res.json({url: session.url});


    if (res.status(200)){
      console.log('success');
    }

  }catch (e) {
    res.status(500).json({error: e.message});
    console.log(e.message);
  }
});

app.listen(port, () => console.log(`app is listening on port ${port}.`));